import { AxiosError, HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import { HOTMART_API, EDUZZ_API } from "../service";
import moment from 'moment';

export const searchOrderController = async (req: Request, res: Response) => {
    try {
        const transaction = String(req.query.transaction)

        const { data } = await HOTMART_API.get('/sales/history', {
            params: {
                transaction
            }
        })

        const hotmartOrder = data.items[0]

        let externalOrder: {
            buyer: {
                external_id: string
                email: string
                name: string
            },
            date: Date
        } | undefined

        if (!hotmartOrder) {
            const eduzzResponse = await EDUZZ_API.get(`/sale/get_sale/${req.query.transaction}`)
            
            const eduzzOrder = eduzzResponse.data.data[0]

            if (eduzzOrder) {
                externalOrder = {
                    ...externalOrder,
                    buyer: {
                        email: eduzzOrder.client_email,
                        name: eduzzOrder.client_name,
                        external_id: String(eduzzOrder.client_id),
                    },
                    date: new Date(eduzzOrder.date_create)
                }
            } else {
                return res.status(HttpStatusCode.Forbidden).json({
                    message: 'Pedido não encontrado.'
                })
            }
        } else {
            externalOrder = {
                ...externalOrder,
                buyer: {
                    email: hotmartOrder.buyer.email,
                    name: hotmartOrder.buyer.name,
                    external_id: hotmartOrder.buyer.ucode,
                },
                date: new Date(hotmartOrder.purchase.approved_date)
            }
        }

        const date = new Date(externalOrder.date)
        
        const diff = moment().diff(date, 'days')

        if (diff < 7) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Este pedido ainda não tem 7 dias.'
            })
        }

        const order = await db.order.upsert({
            where: {
                transaction
            },
            create: {
                transaction,
                buyer: {
                    connectOrCreate: {
                        where: {
                            external_id: externalOrder.buyer.external_id
                        },
                        create: {
                            email: externalOrder.buyer.email,
                            name: externalOrder.buyer.name,
                            external_id: externalOrder.buyer.external_id,
                            buyer_verification: {
                                create: {
                                    status: 'PENDING',
                                }
                            }
                        },
                    }
                }
            },
            update: {},
            include: {
                buyer: {
                    include: {
                        buyer_verification: true
                    }
                }
            }
        })

        return res.status(HttpStatusCode.Accepted).json(order)
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}