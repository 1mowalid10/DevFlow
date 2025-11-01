import { GoogleGenAI } from "@google/genai";
import { Task, TaskStatus } from "../types";

// استبدل السطر القديم بهذا السطر
const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface GeneratedTask {
  title: string;
  description: string;
  durationDays: number;
}

export const generateTasksForPhase = async (phaseTitle: string, lastTask: Task | null): Promise<Task[]> => {
  try {
    const prompt = `Generate a list of typical software development tasks for the project phase: "${phaseTitle}". For each task, provide a title, a brief description, and an estimated duration in days.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "The title of the task.",
                  },
                  description: {
                    type: Type.STRING,
                    description: "A brief description of the task.",
                  },
                  durationDays: {
                    type: Type.NUMBER,
                    description: "The estimated duration of the task in days."
                  }
                },
                required: ["title", "description", "durationDays"],
              },
            },
          },
          required: ["tasks"],
        },
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result.tasks && Array.isArray(result.tasks)) {
        let nextStartDate = lastTask ? new Date(lastTask.dueDate) : new Date();
        nextStartDate.setDate(nextStartDate.getDate() + 1);

        const generatedTasks: GeneratedTask[] = result.tasks.map((t: any) => ({
            title: t.title || 'Untitled Task',
            description: t.description || '',
            durationDays: typeof t.durationDays === 'number' && t.durationDays > 0 ? t.durationDays : 1
        }));
        
        return generatedTasks.map((task, index) => {
            const startDate = new Date(nextStartDate);
            const dueDate = new Date(startDate);
            dueDate.setDate(startDate.getDate() + task.durationDays);
            
            // For the next task
            nextStartDate = new Date(dueDate);
            nextStartDate.setDate(nextStartDate.getDate() + 1);

            return {
                ...task,
                id: `task-gen-${phaseTitle.replace(/\s/g, '')}-${Date.now()}-${index}`,
                status: TaskStatus.ToDo,
                assigneeId: null,
                dependencies: lastTask ? [lastTask.id] : [],
                startDate,
                dueDate,
            };
        });
    }
    return [];

  } catch (error) {
    console.error("Error generating tasks with Gemini API:", error);
    return [];
  }
};
