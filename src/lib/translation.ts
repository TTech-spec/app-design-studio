const GROQ_API_KEY = "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";

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate the given text to ${targetLanguage}. Only return the translated text, nothing else.`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || text;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

export async function detectLanguage(text: string): Promise<string> {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: "Detect the language of the given text. Return only the ISO 639-1 language code (e.g., 'en', 'yo', 'ha', 'ig')."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      throw new Error(`Language detection error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || "en";
  } catch (error) {
    console.error("Language detection error:", error);
    return "en";
  }
}
