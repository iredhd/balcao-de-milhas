import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import { db } from "../db";

export const webhookAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { secret } = req.headers

    if (secret !== process.env.WEBHOOK_SECRET) {
      return res.status(401).json()
    }

    return next()
  }