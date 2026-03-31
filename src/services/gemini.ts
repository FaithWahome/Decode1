import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeCreditworthiness(data: any) {
  const model = "gemini-3-flash-preview";
  const prompt = `
    Analyze the following alternative data for a small business owner/individual in Kenya to predict creditworthiness.
    Data: ${JSON.stringify(data)}

    Provide a response in JSON format with the following structure:
    {
      "score": number (0-1000),
      "rating": "Excellent" | "Good" | "Fair" | "Poor",
      "summary": "A brief summary for the user in simple English/Swahili mix (Sheng) if appropriate, but keep it professional.",
      "keyFactors": [
        { "factor": "string", "impact": "positive" | "negative", "description": "string" }
      ],
      "recommendations": ["string"]
    }

    Consider:
    - M-Pesa transaction frequency and volume.
    - Utility payment consistency.
    - Business record trends (SMS logs).
    - Saving patterns vs spending.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
