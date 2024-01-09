import { NextFunction, Request, Response } from "express"
import moment from "moment";
import { db } from "../db";

export const removeOldRowsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await db.bid.deleteMany({
        where: {
          created_at: {
            lte: moment().subtract(2, 'days').toDate()
          }
        }
      })

      await db.news.deleteMany({
        where: {
          created_at: {
            lte: moment().subtract(2, 'days').toDate()
          }
        }
      })

    return next();
    } catch (err) {
      return res.status(500).end()
    }
  }