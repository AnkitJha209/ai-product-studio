import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { prisma } from "../utils/prismaClient";

export const guestSession =  async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.create({})
        
        const token = jwt.sign({ userId : user.id}, "JWT_SECRET", {expiresIn: '30d'})

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: true 
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: true,
            message: "Internal Server Error"
        })
    }
}