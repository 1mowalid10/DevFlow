import { GoogleGenerativeAI } from "@google/genai";

const ai = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

export const generateTasksForPhase = async (phaseTitle: string, lastTask: any | null): Promise<any[]> => {
  try {
    const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const prompt = 'Generate tasks for phase: ${phaseTitle}'; // <--- تم الإصلاح هنا
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const exampleData = { title: "Generated Content", description: text };
    
    return [exampleData]; 

  } catch (error) {
    console.error("Error generating tasks:", error);
    return [];
  }
};
