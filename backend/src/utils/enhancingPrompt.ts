import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({});
export const enhancePrompt = async (base64ImageFile: any, text: string) => {
    const contents = [
        {
            inilineData: {
                mimeType: "image/jpeg",
                data: base64ImageFile,
            },
        },
        { text },
    ];

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: contents,
    });
};
