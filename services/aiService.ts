
// Fix: Use correct import for GoogleGenAI SDK
import { GoogleGenAI } from "@google/genai";

export const aiService = {
  /**
   * Generates a minimalist logo using Gemini's image generation capabilities.
   * Complies with strict @google/genai guidelines for model selection and API key access.
   */
  async generateLogo(): Promise<string | null> {
    try {
      // Fix: Exclusively use process.env.API_KEY for initialization as required
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = "A minimalist and elegant vector logo for a Christian app named 'Jornada de Fé'. The design should feature a subtle, modern golden Christian cross that blends into a simplified mountain horizon or a rising sun. Style: Ultra-minimalist, clean lines, sophisticated. Colors: Matte gold (#C2A385) and deep midnight blue (#2C3E50). Background: Pure white. The logo must be centered, symmetrical, and high-contrast, suitable for a premium mobile app icon. No text.";

      // Fix: Generate image using gemini-2.5-flash-image with correct parameter structure
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      // Fix: Iterate through response parts to identify and extract the generated image data
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
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
