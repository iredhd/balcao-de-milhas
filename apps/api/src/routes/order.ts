import { Router } from 'express'
import { schemaValidator } from '../middlewares'
import { createDeviceController, searchOrderController } from '../controllers'
import { CreateDeviceValidationSchema } from '@balcao-de-milhas/validations'

export const order = Router()

order.get('/search', searchOrderController)
