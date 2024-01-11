import { NextFunction, Response, Request } from "express"
import jwt from 'jsonwebtoken'

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        message: 'Você deve estar logado para acessar esta informação.'
      })
    }
  
    try {
      const match = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number }
  
      return next();
    } catch (err) {
      return res.status(401).json({
        message: 'Você deve estar logado para acessar esta informação.'
      })
    }
  }