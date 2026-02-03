import { Response } from "express";
import { enhancePrompt } from "../utils/enhancingPrompt";
import { generateImageHuggingFace } from "../utils/huggingFaceApi";
import { AuthReq } from "../middleware/authVerification";
import { prisma } from "../utils/prismaClient";
import sharp from "sharp";

export const generateFromHuggingFace = async (req: AuthReq, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        console.log(req.user.id);

        const { userPrompt } = req.body;
        console.log(userPrompt);

        if (!userPrompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image file uploaded",
            });
        }
        const optimizedImage = await sharp(req.file.buffer)
                                        .resize(512, 512, { fit: "inside" })
                                        .jpeg({ quality: 60 })
                                        .toBuffer();

        const base64Image = optimizedImage.toString("base64");

        console.log(base64Image.length)

        const enhancedPrompt = await enhancePrompt(
            base64Image,
            userPrompt.trim(),
        );
        console.log(enhancedPrompt);

        if (!enhancedPrompt) {
            res.status(400).json({
                success: false,
                message: "Enhance prompt is not available",
            });
            return;
        }

        const imageUrl = await generateImageHuggingFace(enhancedPrompt, userPrompt);

        const image = await prisma.images.create({
            data: {
                userPrompt,
                enhancedPrompt,
                imageUrl,
                userId: req.user.id,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Image generated successfully",
            image,
        });
    } catch (error) {
        console.error("Image generation failed:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate image",
        });
    }
};
