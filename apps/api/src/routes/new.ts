import { Router } from 'express'
import { getNewsController } from '../controllers'

export const news = Router()

news.get('/', getNewsController)
