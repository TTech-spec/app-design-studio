const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new Error("Groq API key not configured");
  }

  const languageMap: Record<string, string> = {
    "en": "English",
    "ha": "Hausa",
    "yo": "Yoruba",
    "ig": "Igbo",
    "pcm": "Nigerian Pidgin",
    "fr": "French",
    "es": "Spanish",
    "pt": "Portuguese",
    "ar": "Arabic",
  };

  const targetLangName = languageMap[targetLanguage] || targetLanguage;

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
            content: `You are a professional translator. Translate the given text to ${targetLangName}. Only return the translated text, nothing else. Keep the meaning and tone intact.`
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
      const error = await response.json();
      throw new Error(error.error?.message || `Translation API error: ${response.statusText}`);
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
