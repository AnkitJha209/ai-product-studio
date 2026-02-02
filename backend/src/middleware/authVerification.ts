import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface AuthReq extends Request{
    user?: JwtPayload
}

export const verify = async (req: AuthReq, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token
        
        if(!token){
            res.status(404).json({
                success: false,
                message: "Token not found please sign in as a guest user"
            })
            return
        }

        const decode = jwt.verify(token, "JWT_SECRET") as JwtPayload

        req.user = {id : decode.userId}
        next()
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}