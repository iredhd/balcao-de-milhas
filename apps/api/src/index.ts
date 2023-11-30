import express from 'express'
import {bid} from './routes'
import cors from 'cors'
import morgan from 'morgan'
import { config } from 'dotenv'
import { logMiddleware } from './middlewares'

const app = express()

config()


app.set('trust proxy', true)
app.use(morgan('tiny'));
app.use(express.json());
app.use(logMiddleware)
app.use(cors());

app.get('/', (_, res) => {
  return res.status(200).json({
    status: 'BDM: alive'
  }) 
})

app.post('/webhook/bdm', (req, res) => {
  return res.status(200).json({})
})

app.post('/webhook/milha-news', (req, res) => {
  return res.status(200).json({})
})

app.use('/bid', bid)

app.listen(process.env.API_PORT, () => console.log(`Server running on port ${process.env.API_PORT}`))