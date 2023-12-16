import { NextFunction, Request, Response } from 'express';
import * as Yup from 'yup';

export const schemaValidator = (schema: Yup.Schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body);
    return next();
  } catch (err) {
    const error = err as Yup.ValidationError
    
    return res.status(400).json({ error });
  }
}