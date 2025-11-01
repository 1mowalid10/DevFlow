import { GoogleGenerativeAI } from "@google/genai";
// 1. لقد قمنا بإصلاح هذا السطر ليعمل (افترضنا أن المسار هو ./types)
import { type Task, taskStatus } from "./types"; 

// 2. هذا هو السطر الذي ينشئ الاتصال، ويقرأ المفتاح من Vercel
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


// --- باقي الكود الخاص بك ---

interface GeneratedTask {
  title: string;
  description: string;
  durationInDays: number;
}

// 3. الكود الآن يعرف ما هي "Task"
export const generateTasksForPhase = async (phaseTitle: string, lastTask: Task | null): Promise<Task[]> => {
  try {
    // 4. هذا هو السطر الذي أصلحنا فيه الخطأ (أضفنا ``)
    const model = ai.getGenerativeModel({ model: "gemini-pro" });
    const prompt = 'Generate tasks for phase: ${phaseTitle}'; // <--- تم الإصلاح هنا
    
    // ...
    // ... (باقي الكود الخاص بك)
    // ...
    
    // هذا مجرد مثال لإرجاع بيانات
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const exampleTask: GeneratedTask = { title: text.substring(0, 20), description: text, durationInDays: 1 };
    
    // @ts-ignore
    return [exampleTask]; 

  } catch (error) {
    console.error("Error generating tasks:", error);
    return [];
  }
};
