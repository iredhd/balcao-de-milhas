import express from 'express'
import {bid, news, webhook} from './routes'
import cors from 'cors'
import morgan from 'morgan'
import { config } from 'dotenv'
import { logMiddleware, webhookAuthMiddleware } from './middlewares'

const app = express()

config()

app.set('trust proxy', true)
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(logMiddleware)

app.get('/', (_, res) => {
  return res.status(200).json({
    status: 'BDM: alive'
  }) 
})

app.use('/bid', bid)
app.use('/news', news)
app.use('/webhook', webhookAuthMiddleware, webhook)

app.listen(process.env.API_PORT, () => console.log(`Server running on port ${process.env.API_PORT}`))