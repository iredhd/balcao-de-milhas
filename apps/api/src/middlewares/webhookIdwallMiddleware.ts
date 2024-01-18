import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import { db } from "../db";

export const webhookIdwallMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const secret = req.headers['secret-token']

    if (secret !== process.env.ID_WALL_SECRET) {
      return res.status(401).end()
    }

    return next()
  }