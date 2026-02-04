import { Router } from "express";
import { guestSession } from "../controllers/auth";

export const authRouter : Router = Router()

authRouter.post('/auth/guest-session', guestSession)