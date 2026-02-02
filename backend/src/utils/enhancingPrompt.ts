import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const enhancePrompt = async (
    base64ImageFile: string,
    userPrompt: string,
) => {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: base64ImageFile,
                        },
                    },
                    {
                        text: `
                            You are an expert product photography prompt engineer.

                            Analyze the provided product image carefully.
                            Then enhance the user's prompt to generate a professional studio-quality product photo.

                            User prompt:
                            "${userPrompt}"

                            Return ONLY the enhanced prompt. No explanations.
                        `,
                    },
                ],
            },
        ],
    });

    return response.text;
};
