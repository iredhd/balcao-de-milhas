import { Router } from 'express'
import { getBidsController } from '../controllers'

export const bid = Router()

bid.get('/', getBidsController)
