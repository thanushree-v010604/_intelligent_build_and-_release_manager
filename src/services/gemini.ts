export async function generateProject(prompt: string, language: string) {
  try {
    // Try multiple ways to get the API key
    let apiKey = process.env.GEMINI_API_KEY;
    
    // If not available, try import.meta.env
    if (!apiKey) {
      apiKey = import.meta.env.VITE_GROQ_API_KEY;
    }
    if (!apiKey) {
      apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    }
    
    console.log("🔍 API Key Check:");
    console.log("  process.env.GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✓ Found" : "✗ Not found");
    console.log("  import.meta.env.VITE_GROQ_API_KEY:", import.meta.env.VITE_GROQ_API_KEY ? "✓ Found" : "✗ Not found");
    console.log("  import.meta.env.VITE_GEMINI_API_KEY:", import.meta.env.VITE_GEMINI_API_KEY ? "✓ Found" : "✗ Not found");
    console.log("  Final API Key:", apiKey ? `${apiKey.substring(0, 15)}...` : "❌ NOT FOUND");
    console.log("  All env vars:", import.meta.env);

    if (!apiKey) throw new Error("API key missing - check console output");

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

    console.log("📡 API Response Status:", response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API Error Response:", errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ API Response Data:", data);
    let text = data.choices?.[0]?.message?.content || data.choices?.[0]?.text || "";
    
    console.log("📝 Raw Response Text (first 500 chars):", text.substring(0, 500));

    // remove markdown fences if any
    text = text.replace(/```json|```/g, "").trim();

    function extractJSON(text: string) {
      // Try to find the first complete JSON object
      let braceCount = 0;
      let inString = false;
      let escape = false;
      let start = -1;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Handle escape sequences
        if (escape) {
          escape = false;
          continue;
        }
        if (char === '\\') {
          escape = true;
          continue;
        }

        // Handle strings
        if (char === '"' && !escape) {
          inString = !inString;
          continue;
        }

        // Skip if we're inside a string
        if (inString) continue;

        // Track braces
        if (char === '{') {
          if (braceCount === 0) start = i;
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0 && start !== -1) {
            const jsonStr = text.substring(start, i + 1);
            try {
              console.log("🔍 Attempting to parse JSON:", jsonStr.substring(0, 100));
              const parsed = JSON.parse(jsonStr);
              console.log("✅ JSON parsed successfully");
              return parsed;
            } catch (e) {
              console.error("❌ JSON parse failed:", e);
              start = -1;
            }
          }
        }
      }
      
      console.warn("⚠️ No valid JSON found in response");
      return null;
    }

    let parsed: any = null;

    try {
      parsed = extractJSON(text);
    } catch (err) {
      console.error("❌ extractJSON error:", err);
      parsed = null;
    }

    if (!parsed) {
      console.warn("❌ JSON parsing failed, returning raw text as code");
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

    console.log("📊 Parsed result:", {
      codeLength: parsed.code?.length || 0,
      explanation: parsed.explanation?.substring(0, 50),
      suggestions: parsed.suggestions?.substring(0, 50),
      accuracy
    });

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