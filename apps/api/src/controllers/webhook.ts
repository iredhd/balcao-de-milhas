import axios, { HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import { IDWALL_API } from "../service";
import {config} from 'dotenv'

config()

export const handleIdWallResponseController = async (req: Request, res: Response) => {
    try {
        const buyer = await db.buyer.findFirst({
            where: {
                document: req.body.profileRef
            },
            include: {
                buyer_verification: true,
                orders: true
            }
        })

        if (!buyer || !buyer?.buyer_verification) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Usuário/Validação não encontrado.'
            })
        }

        const { data: { data } } = await IDWALL_API.get(`/profile/${req.body.profileRef}/lastProfileFlow`)
        const { data: { data: profileData } } = await IDWALL_API.get(`/profile/${req.body.profileRef}`)

        if (!['FINISHED', 'INVALID', 'WAITING_MANUAL_ACTION'].includes(data.status)) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Nada a ser feito.'
            })
        }

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

        await axios.post(`https://hook.us1.make.com/nzeweiv1hp4yqbtpjplt1ej1az9za0a8`, {
            status,
            secret: process.env.MAKE_WEBHOOK_SECRET,
            idwall_payload: profileData,
            bdm_payload: buyer,
        }, {
            headers: {
                secret: process.env.MAKE_WEBHOOK_SECRET
            }
        })

        return res.status(HttpStatusCode.Accepted).json()
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}