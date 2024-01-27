import axios, { AxiosError, HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import { IDWALL_API } from "../service";
import {config} from 'dotenv'
import fs from 'fs'
import http from 'http'
import os from 'os'
import { v4 as uuidv4 } from 'uuid';

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

export const handleCheapFlightsWebhookController = async (req: Request, res: Response) => {
    try {
        let file_path: string
        let token: string

        try {
            const { data } = await axios.get(`https://api.telegram.org/bot${process.env.LCM_TELEGRAM_BOT_TOKEN}/getfile?file_id=${req.body.file_id}`)
            
            if (data.ok) {
                token = String(process.env.LCM_TELEGRAM_BOT_TOKEN)
                file_path = data.result.file_path
            }
        } catch (e) {
            const error = e as AxiosError
            
            if (error.response?.status !== HttpStatusCode.BadRequest) {
                return res.status(403).json()
            }

            try {
                const { data } = await axios.get(`https://api.telegram.org/bot${process.env.VCM_TELEGRAM_BOT_TOKEN}/getfile?file_id=${req.body.file_id}`)
                
                if (data.ok) {
                    token = String(process.env.VCM_TELEGRAM_BOT_TOKEN)
                    file_path = data.result.file_path
                }
            } catch (e) {
                return res.status(403).json()
            }
        }

        const path = await new Promise(async (resolve) => {
            const filename = uuidv4()
            const path = process.env.DATAFILES_PATH ? `${process.env.DATAFILES_PATH}/${filename}` : `${os.tmpdir}/${filename}`
            
            const { data } = await axios.get(`https://api.telegram.org/file/bot${String(token)}/${String(file_path)}`, { responseType: "stream" });
            data.pipe(fs.createWriteStream(path));
        
            resolve(path)
        })

        await db.flight.create({
            data: {
                text: req.body.text,
                file: path ? String(path) : null
            }
        })

        return res.status(HttpStatusCode.Accepted).json()
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}