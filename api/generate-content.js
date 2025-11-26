const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.PERPLEXITY_API_KEY;
  const { skillName, levelTitle, goal, difficulty } = req.body;

  if (!skillName || !levelTitle || !goal || !difficulty) {
    return res.status(400).json({ error: 'Skilldaten fehlen' });
  }

  const prompt = `
    Du bist ein Lern-Mentor für "Rick2Skill". Erstelle 3 spannende Aufgaben für "${skillName}" (Level: "${levelTitle}").
    Nutzer-Ziel: "${goal}". Aktuelle Schwierigkeit (1-10): ${difficulty}.
    Generiere einen Mix aus diesen Typen:
    1. "quiz": Multiple Choice.
    2. "video": YouTube Video ID zu einem passenden Tutorial finden.
    3. "flashcard": Ein Fakt zum Merken (Vorderseite/Rückseite).
    4. "challenge": Eine kleine Praxis-Herausforderung.
    Antworte NUR mit JSON:
    { "tasks": [
        { "type": "quiz", "title": "...", "description": "Frage?", "options": ["A","B","C","D"], "correct_answer": 0 },
        { "type": "video", "title": "...", "description": "...", "video_id": "..." },
        { "type": "flashcard", "title": "Merkkarte", "front": "Begriff", "back": "Erklärung" },
        { "type": "challenge", "title": "...", "description": "..." }
    ]}
  `;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: "system", content: "Antworte nur mit validem JSON." },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: 'API request failed', details: errText });
    }

    const data = await response.json();

    // Extrahiere den JSON-String aus der Antwort und parse ihn
    let rawContent = data.choices?.[0]?.message?.content?.trim();

    if (!rawContent) {
      return res.status(500).json({ error: 'Keine Daten im Antwortinhalt' });
    }

    // Versuche den JSON-String zu parsen
    let result;
    try {
      result = JSON.parse(rawContent);
    } catch (parseError) {
      // Manchmal sendet die KI ein JSON als String in Anführungszeichen - versuche es zu parsen mit Regex falls nötig
      const match = rawContent.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        return res.status(500).json({ error: 'Kein gültiges JSON von KI', details: parseError.message });
      }
    }

    // Optional: Validierung, ob result.tasks existiert und ein Array ist
    if (!result.tasks || !Array.isArray(result.tasks)) {
      return res.status(500).json({ error: 'Ungültige Struktur: tasks fehlt oder ist kein Array' });
    }

    // Sende das Ergebnis mit tasks an das Frontend
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: 'Server-Fehler', details: error.message });
  }
}
