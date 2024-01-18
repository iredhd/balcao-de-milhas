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
                document: req.body.document.replace(/\D/ig, ''),
                address_cep: req.body.address_cep.replace(/\D/ig, ''),
                address_city: req.body.address_city,
                address_complement: req.body.address_complement || null,
                address_country: req.body.address_country,
                address_neighborhood: req.body.address_neighborhood,
                address_number: req.body.address_number,
                address_state: req.body.address_state,
                address_street: req.body.address_street,
                phone_number: req.body.phone_number.replace(/\D/ig, ''),
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
                id: updatedBuyer?.buyer_verification?.id,
            }, process.env.VERIFICATION_JWT_TOKEN as string, {
                expiresIn: '5m'
            })
        })
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}