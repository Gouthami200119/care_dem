import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const body = event.body ? JSON.parse(event.body) : {};
  const { message, language } = body;
  if (!message) return { statusCode: 400, body: JSON.stringify({ error: 'Message is required' }) };

  const API_KEY = process.env.GEMINI_API_KEY || '';
  if (!API_KEY) {
    return { statusCode: 501, body: JSON.stringify({ text: 'Demo Mode: API Key not configured on server.' }) };
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful assistant for a Care Placement Platform in Germany. The user language is ${language}.`;

    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: { systemInstruction },
    });

    return { statusCode: 200, body: JSON.stringify({ text: response.text || "I'm sorry, I couldn't generate a response." }) };
  } catch (error) {
    console.error('Gemini API Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Assistant currently unavailable.' }) };
  }
};
