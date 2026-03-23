import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || "";

export interface MatchResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const aiService = {
  async generateResponse(prompt: string, systemInstruction?: string) {
    if (!API_KEY) {
      throw new Error("Gemini API Key is missing. Please add it to your environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "أنت مساعد ذكي لتطبيق كفراوي (Kafrawy Super App). تطبيق يخدم سكان منطقة الكفراوي بالعبور. ساعد المستخدمين في كتابة منشورات، تحسين سيرتهم الذاتية، أو العثور على خدمات. كن ودوداً ولهجتك مصرية خفيفة.",
      },
    });

    return response.text;
  },

  async analyzeJobMatch(jobDescription: string, userCV: string): Promise<MatchResult> {
    const prompt = `حلل مدى توافق السيرة الذاتية التالية مع وصف الوظيفة. أعطِ نسبة مئوية ونقاط القوة والضعف وتوصيات للتحسين. أرجع النتيجة بتنسيق JSON فقط.\n\nالوظيفة: ${jobDescription}\n\nالسيرة الذاتية: ${userCV}`;
    const systemInstruction = "أنت خبير توظيف ذكي. حلل البيانات بدقة واحترافية. يجب أن يكون الرد بتنسيق JSON يحتوي على الحقول التالية: score (رقم من 0 لـ 100), strengths (مصفوفة نصوص), weaknesses (مصفوفة نصوص), recommendations (مصفوفة نصوص).";
    
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json"
      },
    });

    try {
      return JSON.parse(response.text) as MatchResult;
    } catch (e) {
      return {
        score: 0,
        strengths: [],
        weaknesses: ["فشل في تحليل البيانات"],
        recommendations: ["حاول مرة أخرى لاحقاً"]
      };
    }
  },

  async analyzeJobCompatibility(jobDescription: string, userCV: string) {
    return this.analyzeJobMatch(jobDescription, userCV);
  }
};
