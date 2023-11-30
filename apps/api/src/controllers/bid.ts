import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";

export const getBidsController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page || 1) - 1
        const limit = 50

        const items = await db.bid.findMany({
            skip: page * limit,
            take: limit
        })

        const total = await db.bid.count()

        return res.json({
            items,
            pagination: {
                total,
                limit,
                page: page + 1
            }
        })
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}