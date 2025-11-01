import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateTasks(phaseTitle) {
  try {
    const ai = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);
    const model = ai.getGenerativeModel({ model: "gemini-pro" });

    const prompt = Generate tasks for phase: ${phaseTitle};
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error("Error generating tasks:", error);
    return "Error generating tasks";
  }
}
