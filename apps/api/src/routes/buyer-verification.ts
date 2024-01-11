import { Router } from 'express'
import { authMiddleware, schemaValidator } from '../middlewares'
import { getBuyerVerificationsController, updateBuyerVerificationByQuery } from '../controllers'
import { UpdateBuyerVerificationValidationSchema } from '@balcao-de-milhas/validations'

export const buyerVerification = Router()

buyerVerification.put('/', schemaValidator(UpdateBuyerVerificationValidationSchema), updateBuyerVerificationByQuery)
buyerVerification.get('/', authMiddleware, getBuyerVerificationsController)
