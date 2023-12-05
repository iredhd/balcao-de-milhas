import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";

export const getNewsController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page || 1) - 1
        const limit = 20
            
        const items = await db.news.findMany({
            skip: page * limit,
            take: limit,
            orderBy: {
                'created_at': 'desc'
            },
        })

        const total = await db.bid.count({
            orderBy: {
                created_at: 'desc'
            }
        })

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