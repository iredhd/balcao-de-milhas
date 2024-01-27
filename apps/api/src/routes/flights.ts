import { Router } from 'express'
import { schemaValidator } from '../middlewares'
import { createFlightsAppDeviceController } from '../controllers'
import { CreateDeviceValidationSchema } from '@balcao-de-milhas/validations'
import { getFlightFileController, getFlightsController } from '../controllers'

export const flights = Router()

flights.post('/device', createFlightsAppDeviceController)
flights.get('/flight', getFlightsController)
flights.get('/flight/:id/file', getFlightFileController)
