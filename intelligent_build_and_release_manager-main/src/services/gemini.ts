const apiKey = import.meta.env.VITE_GROQ_API_KEY;

export async function generateProject(prompt: string, language: string) {
  const systemInstruction = `
You are an expert full-stack developer and UI/UX designer.
Generate production-ready code + explanation + suggestions + accuracy + UI.
Return response in JSON format.
`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: `Generate a project for: "${prompt}" using ${language}. Return JSON.` }
      ]
    })
  });

  const data = await response.json();

  // Groq response format
  const text = data.choices?.[0]?.message?.content;

  try {
    return JSON.parse(text);
  } catch {
    console.error("Invalid JSON from AI:", text);
    return {
      code: "",
      explanation: text,
      suggestions: "",
      accuracy: 0,
      uiDesign: ""
    };
  }
}