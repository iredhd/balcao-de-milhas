import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import { db } from "../db";

export const logMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: Prisma.logCreateInput = {
          url: req.url,
          body: req.body,
          headers: req.headers,
          ip: req.ip || req.socket.remoteAddress || '',
          method: req.method as 'POST',
        } 

        await db.log.create({
          data: payload
        })
  
      return next();
    } catch (err) {
      return res.status(500).end()
    }
  }