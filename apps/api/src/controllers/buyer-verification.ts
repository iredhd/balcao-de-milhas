import { HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import jwt from 'jsonwebtoken'

export const updateBuyerVerificationByQuery = async (req: Request, res: Response) => {
    try {
        const match = jwt.verify(req.body.token, process.env.VERIFICATION_JWT_TOKEN as string) as { id: number }

        const buyerVerification = await db.buyer_verification.findUnique({
            where: {
                id: match.id
            }
        })

        if (!buyerVerification) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Token inválido.'
            })
        }

        if (buyerVerification.status !== 'PENDING') {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Não é possível atualizar esta validação.'
            })
        }

        await db.buyer_verification.update({
            where: {
                id: match.id
            },
            data: {
                external_id: req.body.external_id,
                status: 'COMPLETED'
            }
        })

        return res.status(HttpStatusCode.NoContent).end()
    } catch (e) {
        return res.status(HttpStatusCode.InternalServerError).json({
            message: INTERNAL_ERROR
        })
    }
}

export const getBuyerVerificationsController = async (req: Request, res: Response) => {
    try {
        const buyerVerifications = await db.buyer_verification.findMany({
            include: {
                buyer: {
                    include: {
                        orders: true
                    }
                }
            }
        })

        return res.json(buyerVerifications)
    } catch (e) {
        return res.status(HttpStatusCode.InternalServerError).json({
            message: INTERNAL_ERROR
        })
    }
}