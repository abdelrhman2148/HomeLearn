import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedLessonPlan, Subject } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini client
// Note: In a real production app, ensure this is handled securely.
// The prompt instructions say to assume process.env.API_KEY is available.
const ai = new GoogleGenAI({ apiKey });

const lessonPlanSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy title for the lesson" },
    description: { type: Type.STRING, description: "A brief summary of what will be taught" },
    durationMinutes: { type: Type.INTEGER, description: "Estimated time in minutes" },
    resources: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['book', 'video', 'website', 'worksheet'] },
          url: { type: Type.STRING, description: "A placeholder URL if applicable" }
        }
      }
    },
    tasks: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3-5 specific activities or tasks for the student"
    }
  },
  required: ["title", "description", "durationMinutes", "resources", "tasks"]
};

export const generateLessonPlan = async (
  topic: string,
  subject: Subject,
  gradeLevel: string,
  duration: number
): Promise<GeneratedLessonPlan | null> => {
  if (!apiKey) {
    console.error("API Key is missing");
    return null;
  }

  try {
    const prompt = `Create a homeschool lesson plan for a ${gradeLevel} student in ${subject}. 
    The specific topic is: "${topic}". 
    The lesson should take approximately ${duration} minutes.
    Provide realistic resource suggestions (books, youtube search terms, etc).`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonPlanSchema,
        systemInstruction: "You are an expert homeschool curriculum developer helping a parent.",
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) return null;

    return JSON.parse(text) as GeneratedLessonPlan;

  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return null;
  }
};
