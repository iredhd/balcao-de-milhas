import { Router } from 'express'
import { schemaValidator } from '../middlewares'
import { updateBuyerByQueryController } from '../controllers'
import { UpdateBuyerValidationSchema } from '@balcao-de-milhas/validations'

export const buyer = Router()

buyer.put('/', schemaValidator(UpdateBuyerValidationSchema), updateBuyerByQueryController)
