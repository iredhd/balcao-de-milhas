import { HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import jwt from 'jsonwebtoken'

export const updateBuyerByQueryController = async (req: Request, res: Response) => {
    try {
        const externalId = String(req.query.external_id)

        const buyer = await db.buyer.findUnique({
            where: {
                external_id: externalId
            }
        })

        if (!buyer) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Comprador não encontrado.'
            })
        }

        const updatedBuyer = await db.buyer.update({
            data: {
                name: req.body.name,
                email: req.body.email,
                document: req.body.document.replace(/\D/ig, '')
            },
            where: {
                id: buyer.id
            },
            include: {
                buyer_verification: true
            }
        })

        return res.status(HttpStatusCode.Accepted).json({
            token: jwt.sign({
                id: updatedBuyer.buyer_verification.id,
            }, process.env.VERIFICATION_JWT_TOKEN as string)
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}