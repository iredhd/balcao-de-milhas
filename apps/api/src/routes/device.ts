import { Router } from 'express'
import { schemaValidator } from '../middlewares'
import { createDeviceController } from '../controllers'
import { CreateDeviceValidationSchema } from '@balcao-de-milhas/validations'

export const device = Router()

device.post('/', /*schemaValidator(CreateDeviceValidationSchema),*/ createDeviceController)