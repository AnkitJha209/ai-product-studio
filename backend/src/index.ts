import express, { Application, Request, Response, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import { authRouter } from './routes/auth.route'
import { genRouter } from './routes/huggingface.route'

const app : Application = express()
app.use(express.json())

app.use(urlencoded())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true
    })
})

app.use('/api/v1', authRouter)
app.use('/api/v1/img-generation', genRouter)

app.listen(3000)