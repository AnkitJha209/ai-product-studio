import express, { Application, Request, Response, urlencoded } from 'express'
import cookieParser from 'cookie-parser'

const app : Application = express()

app.use(express.json())

app.use(urlencoded())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true
    })
})

app.listen(3000)