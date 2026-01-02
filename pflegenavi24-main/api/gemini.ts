import type { IncomingMessage, ServerResponse } from 'http';

// Lightweight handler compatible with Vercel serverless (req, res)
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, language } = req.body || {};
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const API_KEY = process.env.GEMINI_API_KEY || '';
  if (!API_KEY) {
    return res.status(501).json({ text: 'Demo Mode: API Key not configured on server.' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful assistant for a Care Placement Platform in Germany. 
    You help families understand terms like "Pflegegrad", "Kurzzeitpflege", and the "Entlastungsbetrag". 
    The user language is ${language}. Keep answers concise and helpful.`;

    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: { systemInstruction },
    });

    return res.status(200).json({ text: response.text || "I'm sorry, I couldn't generate a response." });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Assistant currently unavailable.' });
  }
}
