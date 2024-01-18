import { AxiosError, HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import jwt, { TokenExpiredError } from 'jsonwebtoken'
import { IDWALL_API } from '../service';

export const updateBuyerVerificationByQuery = async (req: Request, res: Response) => {
    try {
        const match = jwt.verify(req.body.token, process.env.VERIFICATION_JWT_TOKEN as string) as { id: number }

        const buyerVerification = await db.buyer_verification.findUnique({
            where: {
                id: match.id
            },
            include: {
                buyer: true
            }
        })

        if (!buyerVerification || !buyerVerification?.buyer) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Token inválido.'
            })
        }

        if (['APPROVED', 'DENIED', 'WAITING_MANUAL_ACTION'].includes(buyerVerification.status)) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Não é possível atualizar esta validação.'
            })
        }

        if (
            !buyerVerification?.buyer?.document
            || !buyerVerification.buyer.phone_number
        ) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Dados inválidos.'
            })
        }

        const payload: {
            sdkToken: string
            personal: {
                name: string
                cpfNumber: string
            }
            contacts: {
                email: Array<{
                    emailAddress: string
                    isMain: boolean
                }>,
                phone: Array<{
                    type: 'mobile'
                    isMain: boolean
                    ddd: string
                    number: string
                }>
            }
            addresses: Array<{
                type: 'RESIDENTIAL',
                isMain: boolean,
                state: string,
                city: string,
                neighborhood: string,
                complement?: string
                detail: string
                street: string
                zipCode: string
            }>
        } = {
            sdkToken: req.body.external_id,
            personal: {
                name: buyerVerification?.buyer?.name,
                cpfNumber: buyerVerification?.buyer?.document,
            },
            contacts: {
                email: [{
                    emailAddress: buyerVerification?.buyer?.email,
                    isMain: true
                }],
                phone: []
            },
            addresses: []
        }

        if (buyerVerification.buyer.phone_number.startsWith('55')) {
            const ddd = buyerVerification.buyer.phone_number.slice(2, 4)
            const number = buyerVerification.buyer.phone_number.slice(4)

            payload.contacts.phone.push({
                type: 'mobile', 
                isMain: true,
                ddd,
                number
            })
        }

        if (buyerVerification.buyer.address_country === 'BR') {
            if (
                !buyerVerification.buyer.address_city
                || !buyerVerification.buyer.address_number
                || !buyerVerification.buyer.address_neighborhood
                || !buyerVerification.buyer.address_state
                || !buyerVerification.buyer.address_street
                || !buyerVerification.buyer.address_cep
            ) {
                return res.status(HttpStatusCode.Forbidden).json({
                    message: 'Dados de endereço inválidos.'
                }) 
            }

            payload.addresses.push({
                city: buyerVerification.buyer.address_city,
                detail: buyerVerification.buyer.address_number,
                neighborhood: buyerVerification.buyer.address_neighborhood,
                state: buyerVerification.buyer.address_state,
                street: buyerVerification.buyer.address_street,
                zipCode: buyerVerification.buyer.address_cep,
                complement: buyerVerification.buyer.address_complement || '',
                type: 'RESIDENTIAL',
                isMain: true
            })
        }

        let profileExists = false

        try {
            await IDWALL_API.get(`/profile/${buyerVerification?.buyer?.document}`)

            profileExists = true
        } catch (e) {
            profileExists = false
        }

        if (profileExists) {
            await IDWALL_API.put(`/profile/${buyerVerification?.buyer?.document}/sdk?runOCR=true`, payload)
        } else {
            await IDWALL_API.post(`/profile/sdk?runOCR=true`, {
                ...payload,
                ref: buyerVerification?.buyer?.document,
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
        if (e instanceof TokenExpiredError) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Token expirado. Por favor, reinicie a validação.'
            })
        }

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