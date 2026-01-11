
import { GoogleGenAI, Type } from "@google/genai";

// Always use process.env.API_KEY directly when initializing the GoogleGenAI client instance.
export const getGeminiChat = () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are Pigeon AI, the world's most advanced supply chain management assistant for Aditya Gawner. You specialize in real-time logistics, raw material analysis, negotiation strategies, and 'Jarvis-like' interactions. Your tone is professional yet futuristic and helpful. Keep responses concise and insightful.",
    }
  });
};

export const analyzeSupplyData = async (data: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this supply chain data and provide key insights on profit growth and material risks: ${JSON.stringify(data)}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          profitTrend: { type: Type.STRING },
          riskLevel: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['summary', 'profitTrend', 'riskLevel', 'recommendations']
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
