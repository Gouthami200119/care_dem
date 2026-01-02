export const getChatResponse = async (
  message: string,
  language: string
): Promise<string> => {
  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, language }),
    });

    if (!res.ok) {
      // 501 indicates demo mode on server or 4xx/5xx on server
      const body = await res.json().catch(() => ({}));
      if (body && body.text) return body.text as string;
      return "Sorry, the assistant is currently unavailable.";
    }

    const data = await res.json();
    return data.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Network/API Error:', error);
    return "Demo Mode: Unable to reach server-side API. Please set up `GEMINI_API_KEY` in your deployment platform.";
  }
};