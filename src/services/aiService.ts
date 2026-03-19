import { GoogleGenAI, Type } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export interface MatchResult {
  score: number;
  matchReason: string;
  missingSkills: string[];
  advice: string;
}

export const aiService = {
  async analyzeJobMatch(userProfile: any, jobDetails: any): Promise<MatchResult> {
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key is missing");
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    
    const prompt = `
      كمدقق وظائف ذكي، قم بتحليل مدى توافق المستخدم مع الوظيفة التالية.
      
      بيانات المستخدم:
      - الاسم: ${userProfile.full_name}
      - المهارات: ${userProfile.skills?.join(", ") || "غير محددة"}
      - الخبرة: ${userProfile.experience || "غير محددة"}
      - التعليم: ${userProfile.education || "غير محددة"}
      
      بيانات الوظيفة:
      - العنوان: ${jobDetails.title}
      - الشركة: ${jobDetails.company}
      - الوصف: ${jobDetails.description}
      - المتطلبات: ${jobDetails.requirements?.join(", ") || "غير محددة"}
      
      قم بالرد بتنسيق JSON فقط يحتوي على:
      1. score: رقم من 0 إلى 100 يمثل نسبة التوافق.
      2. matchReason: سبب التوافق باختصار باللغة العربية.
      3. missingSkills: قائمة بالمهارات التي تنقص المستخدم لهذه الوظيفة.
      4. advice: نصيحة للمستخدم لتحسين فرصه في القبول.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              matchReason: { type: Type.STRING },
              missingSkills: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              advice: { type: Type.STRING }
            },
            required: ["score", "matchReason", "missingSkills", "advice"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      return result as MatchResult;
    } catch (error) {
      console.error("Error in AI matching:", error);
      return {
        score: 0,
        matchReason: "حدث خطأ أثناء تحليل التوافق.",
        missingSkills: [],
        advice: "يرجى المحاولة مرة أخرى لاحقاً."
      };
    }
  }
};
