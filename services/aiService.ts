
import { GoogleGenAI } from "@google/genai";

const getApiKey = (): string => {
  try {
    return (process as any).env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

export const aiService = {
  async generateLogo(): Promise<string | null> {
    const apiKey = getApiKey();
    if (!apiKey) return null;

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = "A minimalist and elegant vector logo for a Christian app named 'Jornada de Fé'. The design should feature a subtle, modern golden Christian cross that blends into a simplified mountain horizon or a rising sun. Style: Ultra-minimalist, clean lines, sophisticated. Colors: Matte gold (#C2A385) and deep midnight blue (#2C3E50). Background: Pure white. The logo must be centered, symmetrical, and high-contrast, suitable for a premium mobile app icon. No text.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      const candidate = response.candidates?.[0];
      if (candidate && candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Erro ao gerar logo:", error);
      return null;
    }
  }
};
