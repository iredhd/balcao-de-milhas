import { SignInSchema } from '@balcao-de-milhas/validations'
import {Router} from 'express'
import { signInController } from '../controllers'
import { schemaValidator } from '../middlewares'

export const auth = Router()

auth.post('/signin', schemaValidator(SignInSchema), signInController)
 