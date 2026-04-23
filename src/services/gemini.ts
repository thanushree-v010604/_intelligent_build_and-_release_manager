export async function generateProject(prompt: string, language: string) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) throw new Error("API key missing");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a production-ready HTML code generator. Return only valid JSON with the requested output."
          },
          {
            role: "user",
            content: `Build a ${language} app for: ${prompt}.

Return ONLY valid JSON in this format:

{
  "code": "<FULL WORKING HTML APP>",
  "explanation": "<DETAILED explanation of the generated code and app behavior>",
  "suggestions": "<short list of practical improvements>",
  "accuracy": <number>
}

STRICT RULES:
- code must start with <!DOCTYPE html>
- include HTML, CSS, JS in ONE file
- explanation must be at least 4 sentences and describe the layout, interaction, and JavaScript behavior
- suggestions must be a short list of practical improvements, each on its own line
- NO markdown
- NO extra text
- NO explanation inside code
- Do not repeat the prompt text in explanation or suggestions
`,
          }
        ],
        temperature: 0.3,
        max_tokens: 3500,
      }),
    });

    const data = await response.json();
    let text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "";

    // remove markdown fences if any
    text = text.replace(/```json|```/g, "").trim();

    function extractJSON(text: string) {
      const match = text.match(/\{[\s\S]*\}/m);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {}
      }

      let depth = 0;
      let startIndex = -1;
      for (let i = 0; i < text.length; i++) {
        const chr = text[i];
        if (chr === '{') {
          if (startIndex === -1) startIndex = i;
          depth += 1;
        } else if (chr === '}') {
          depth -= 1;
          if (depth === 0 && startIndex !== -1) {
            const slice = text.slice(startIndex, i + 1);
            try {
              return JSON.parse(slice);
            } catch {}
          }
        }
      }
      return null;
    }

    let parsed: any = null;

    try {
      parsed = extractJSON(text);
    } catch {
      parsed = null;
    }

    if (!parsed) {
      return {
        code: text,
        explanation: "Could not parse structured response",
        suggestions: "No AI suggestions were generated.",
        accuracy: 90,
        uiDesign: text,
      };
    }

    const rawAccuracy = Number(parsed.accuracy);
    const accuracy = Number.isFinite(rawAccuracy) && rawAccuracy >= 40 && rawAccuracy <= 100 ? rawAccuracy : 90;

    return {
      code: parsed.code || "",
      explanation: parsed.explanation || "No explanation was generated. Please regenerate.",
      suggestions: parsed.suggestions || "No AI suggestions were generated. Please regenerate.",
      accuracy,
      uiDesign: parsed.code || "",
    };

  } catch (err: any) {
    return {
      code: "",
      explanation: err.message,
      suggestions: "",
      accuracy: 90,
      uiDesign: "",
    };
  }
}