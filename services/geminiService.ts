import { GoogleGenerativeAI } from "@google/genai";

// 1. هذا هو السطر الذي ينشئ الاتصال، ويقرأ المفتاح من Vercel
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// 2. لقد قمنا بحذف "Task" من هنا واستبدالها بـ "any" لتجنب الخطأ
export const generateTasksForPhase = async (phaseTitle: string, lastTask: any | null): Promise<any[]> => {
  try {
    // 3. هذا هو السطر الذي أصلحنا فيه الخطأ (أضفنا ``)
    const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const prompt = 'Generate tasks for phase: ${phaseTitle}'; // <--- تم الإصلاح هنا
    
    // هذا مجرد مثال لإرجاع بيانات
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // سنقوم بإرجاع البيانات كنص بسيط لأننا لا نعرف "Task"
    const exampleData = { title: "Generated Content", description: text };
    
    return [exampleData]; 

  } catch (error) {
    console.error("Error generating tasks:", error);
    return [];
  }
};
