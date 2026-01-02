// Minimal Netlify Function stub that proxies a request to a backend API using a secret stored in Netlify environment variables.
// Configure your 'GEMINI_API_KEY' in the Netlify UI (Site settings → Build & deploy → Environment → Environment variables)

exports.handler = async (event) => {
  if (!process.env.GEMINI_API_KEY) {
    return { statusCode: 500, body: 'GEMINI_API_KEY not configured on Netlify' };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // TODO: Replace the URL and request body with the appropriate Gemini API endpoint and payload
    const resp = await fetch('https://api.example.com/gemini-endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    return { statusCode: resp.status, body: text };
  } catch (err) {
    return { statusCode: 500, body: String(err) };
  }
};