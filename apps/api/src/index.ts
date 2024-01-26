import express from 'express'
import {auth, bid, buyer, buyerVerification, device, news, order, webhook} from './routes'
import cors from 'cors'
import morgan from 'morgan'
import { config } from 'dotenv'
import { logMiddleware, removeOldRowsMiddleware, webhookAuthMiddleware, webhookIdwallMiddleware } from './middlewares'
import { handleIdWallResponseController } from './controllers'

const app = express()

config()

app.set('trust proxy', true)
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(logMiddleware)
app.use(removeOldRowsMiddleware)

app.all('/', (_, res) => {
  return res.status(200).json({
    status: 'BDM: alive'
  }) 
})

app.use('/bid', bid)
app.use('/news', news)
app.post('/webhook/idwall', webhookIdwallMiddleware, handleIdWallResponseController)
app.use('/webhook', webhookAuthMiddleware, webhook)
app.use('/device', device)
app.use('/order', order)
app.use('/buyer', buyer)
app.use('/buyer-verification', buyerVerification)
app.use('/auth', auth)

app.listen(process.env.API_PORT, () => console.log(`Server running on port ${process.env.API_PORT}`))