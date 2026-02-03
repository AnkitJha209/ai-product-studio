import express, { Application, Request, Response, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import { guestSession } from './controllers/auth'
import { verify } from './middleware/authVerification'
import { generateFromHuggingFace } from './controllers/huggingGen.controller'
import { generateFromImgTxtToImg, generateFromTxtToImg } from './controllers/geminiGen.controller'
import multer from "multer";

const app : Application = express()
const upload = multer({storage: multer.memoryStorage() })
app.use(express.json())

app.use(urlencoded())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true
    })
})


app.post('/api/v1/auth/register', guestSession)
app.post('/api/v1/generate-from-hugging-face', verify, upload.single("image"),generateFromHuggingFace)
app.post('/api/v1/generate-from-gemini', verify,upload.single("image"),generateFromTxtToImg)
app.post('/api/v1/generate-from-gemini-nano-version', verify, upload.single("image"),generateFromImgTxtToImg)

app.listen(3000)