import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProject(prompt: string, language: string) {
  const systemInstruction = `
    You are an expert full-stack developer and UI/UX designer.
    Your task is to generate production-ready code for a given prompt in the specified language.
    Additionally, you must provide:
    1. A detailed explanation of the code.
    2. AI suggestions for performance and error fixing.
    3. A build accuracy score (0-100).
    4. A functional UI/UX design (HTML/Tailwind CSS) that represents the "Release" of this project.
    
    The UI/UX design should be a complete, self-contained HTML snippet using Tailwind CSS classes that can be rendered in a preview. 
    It should be functional if possible (e.g., if it's a calculator, the HTML should include script tags for the logic).
    
    Return the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Generate a project for: "${prompt}" using ${language}.`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          code: { type: Type.STRING, description: "The source code in the requested language." },
          explanation: { type: Type.STRING, description: "Detailed explanation of the code." },
          suggestions: { type: Type.STRING, description: "AI suggestions for improvements." },
          accuracy: { type: Type.NUMBER, description: "Estimated build accuracy (0-100)." },
          uiDesign: { type: Type.STRING, description: "Self-contained HTML/Tailwind/JS for the UI preview." }
        },
        required: ["code", "explanation", "suggestions", "accuracy", "uiDesign"]
      }
    }
  });

  return JSON.parse(response.text);
}
