import { AxiosError, HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import { HOTMART_API } from "../service";

export const searchOrderController = async (req: Request, res: Response) => {
    try {
        const transaction = String(req.query.transaction)

        const { data } = await HOTMART_API.get('/sales/history', {
            params: {
                transaction
            }
        })

        const hotmartOrder = data.items[0]

        if (!hotmartOrder) {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Pedido não encontrado.'
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
                            external_id: hotmartOrder.buyer.ucode
                        },
                        create: {
                            email: hotmartOrder.buyer.email,
                            name: hotmartOrder.buyer.name,
                            external_id: hotmartOrder.buyer.ucode,
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