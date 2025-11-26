// API Proxy für sichere Backend-Requests
// ⚠️ Wichtig: Der Perplexity API Key ist **nur** im Backend gespeichert (Vercel) und wird vom Frontend nie verwendet!

/**
 * Diese Funktion ruft deinen Vercel Backend-Endpoint auf,
 * und leitet die Anfrage sicher an die Perplexity API weiter.
 * Im Frontend wird der API-Key NIEMALS genutzt!
 */

export async function generateContentProxy(prompt) {
  // Prüft den Prompt
  if (!prompt) {
    throw new Error('Prompt darf nicht leer sein.');
  }

  // Anfrage an deinen Backend-Proxy auf Vercel
  const response = await fetch("/api/generate-content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  // Fehlerbehandlung, falls etwas schiefgeht
  if (!response.ok) {
    const error = await response.text();
    throw new Error('Fehler vom Backend-Proxy: ' + error);
  }

  // JSON-Antwort weitergeben
  return await response.json();
}
