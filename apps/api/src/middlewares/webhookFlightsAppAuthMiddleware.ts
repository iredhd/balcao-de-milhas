import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import { db } from "../db";

export const webhookFlightsAppAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { secret } = req.headers

    if (secret !== process.env.FLIGHTS_APP_SECRET) {
      return res.status(401).json()
    }

    if (req.originalUrl !== "/flights/device") {
      const deviceId = req.headers['device-id']

      if (!deviceId) {
        return res.status(401).json()
      }

      const device = await db.flights_app_device.findUnique({
        where: {
          device_id: String(deviceId)
        }
      })

      if (!device || !device.active) {
        return res.status(401).json()
      }
    }

    return next()
  }