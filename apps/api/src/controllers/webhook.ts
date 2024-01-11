import { AxiosError, HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import { HOTMART_API, IDWALL_API } from "../service";

export const handleIdWallResponseController = async (req: Request, res: Response) => {
    try {
        const buyer = await db.buyer.findFirst({
            where: {
                document: req.body.profileRef
            },
            include: {
                buyer_verification: true
            }
        })

        if (!buyer || !buyer?.buyer_verification) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Usuário/Validação não encontrado.'
            })
        }

        const { data: { data } } = await IDWALL_API.get(`/profile/${req.body.profileRef}/lastProfileFlow`)

        if (!['FINISHED', 'INVALID', 'WAITING_MANUAL_ACTION'].includes(data.status)) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Nada a ser feito.'
            })
        }

        // TODO: ENVIAR O E-MAIL

        let status: 'DENIED' | 'APPROVED' | 'WAITING_MANUAL_ACTION' = 'DENIED'

        if (data.status === 'FINISHED') {
            status = 'APPROVED'
        } else if (data.status === 'WAITING_MANUAL_ACTION') {
            status = 'WAITING_MANUAL_ACTION'
        }

        await db.buyer_verification.update({
            where: {
                id: buyer?.buyer_verification?.id
            },
            data: {
                status
            }
        })

        return res.status(HttpStatusCode.Accepted).end()
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}