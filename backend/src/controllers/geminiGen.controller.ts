import { Response } from "express";
import { AuthReq } from "../middleware/authVerification";
import { enhancePrompt } from "../utils/enhancingPrompt";
import {
    generateImageFromImgTxtGemini,
    generateImageFromTextGemini,
} from "../utils/geminiApi";
import { prisma } from "../utils/prismaClient";
import sharp from "sharp";

export const generateFromTxtToImg = async (req: AuthReq, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const { userPrompt } = req.body;

        if (!userPrompt) {
            res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "No img file uploaded",
            });
            return;
        }

        const optimizedImage = await sharp(req.file.buffer)
            .resize(512, 512, { fit: "inside" })
            .jpeg({ quality: 60 })
            .toBuffer();

        const base64Image = optimizedImage.toString("base64");

        console.log(base64Image.length);

        const enhancedPrompt = await enhancePrompt(
            base64Image,
            userPrompt.trim(),
        );

        if (!enhancedPrompt) {
            res.status(400).json({
                success: false,
                message: "Enhance prompt is not available",
            });
            return;
        }

        const imageUrl = await generateImageFromTextGemini(enhancedPrompt, userPrompt);

        const image = await prisma.images.create({
            data: {
                userPrompt,
                enhancedPrompt,
                imageUrl,
                userId: req.user.id,
            },
        });

        res.status(200).json({
            success: true,
            message: "Image generated successfully",
            image,
        });

        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

export const generateFromImgTxtToImg = async (req: AuthReq, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }

        const { userPrompt } = req.body;

        if (!userPrompt) {
            res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
            return;
        }

        if (!req.file) {
            res.status(400).json({
                success: false,
                message: "No img file uploaded",
            });
            return;
        }

        const optimizedImage = await sharp(req.file.buffer)
            .resize(512, 512, { fit: "inside" })
            .jpeg({ quality: 60 })
            .toBuffer();

        const base64Image = optimizedImage.toString("base64");

        console.log(base64Image.length);

        const imageUrl = await generateImageFromImgTxtGemini(
            base64Image,
            userPrompt,
        );

        const image = await prisma.images.create({
            data: {
                userPrompt,
                enhancedPrompt: userPrompt,
                imageUrl,
                userId: req.user.id,
            },
        });

        res.status(200).json({
            success: true,
            message: "Image generated successfully",
            image,
        });

        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
