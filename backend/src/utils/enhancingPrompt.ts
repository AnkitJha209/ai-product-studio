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
                            You are a senior prompt engineer specializing in commercial product photography and generative image models.

                            Carefully analyze the provided product image and understand:
                            - the product type
                            - material and texture
                            - color and finish
                            - shape and proportions
                            - visual style and category (luxury, minimal, tech, lifestyle, etc.)

                            Your task is to rewrite and ENHANCE the user's prompt so it will generate a
                            photorealistic, studio-quality product image suitable for e-commerce or advertising.

                            STRICT RULES:
                            - Preserve the exact product identity shown in the image
                            - Do NOT invent new features or modify the product
                            - Do NOT add people, text, logos, or watermarks
                            - Focus on lighting, background, composition, and camera quality
                            - Keep the prompt concise but highly descriptive
                            - Output a SINGLE optimized prompt paragraph

                            User's original prompt:
                            "${userPrompt}"

                            The enhanced prompt should include:
                            - professional studio lighting description
                            - camera / photography quality cues
                            - background and surface description
                            - realism and commercial photography tone

                            Return ONLY the enhanced prompt. No explanations, no formatting.
                        `,
                    },
                ],
            },
        ],
    });

    return response.text;
};
