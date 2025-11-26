const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args)); 

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

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'API request failed', details: data });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server-Fehler', details: error.message });
  }
}
