const API_KEY = process.env.API_KEY || '';

export const getChatResponse = async (
  message: string,
  language: string
): Promise<string> => {
  if (!API_KEY) {
    // Keep module safe to import in browser when no API key is available
    return "Demo Mode: API Key not configured. (Please set VITE_API_KEY in .env or process.env.API_KEY)";
  }

  try {
    // Dynamically import to avoid loading the server-only library during module initialization
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful assistant for a Care Placement Platform in Germany. 
    You help families understand terms like "Pflegegrad" (Care Level), "Kurzzeitpflege" (Short-term care), 
    and the "Entlastungsbetrag" (§45b SGB XI). 
    The user is currently using the application in language code: ${language}. 
    Keep answers concise and helpful for a family member seeking care for a relative.`;

    const response = await ai.models.generateContent({
      model,
      contents: message,
      config: {
        systemInstruction,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, the assistant is currently unavailable.";
  }
};