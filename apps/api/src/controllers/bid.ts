import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import { bid_direction, Prisma } from "@prisma/client";
import {PROGRAMS} from '@balcao-de-milhas/utils'

const allowedColumnsToFilter = ['company', 'is_mentoria', 'is_mastermiles', 'direction']

type FilterItem = {
    condition: 'eq' | 'gt' | 'lt'
    value: string
}

type Filter = {
    company: FilterItem,
    is_mentoria: FilterItem,
    is_mastermiles: FilterItem
}

export const getBidsController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page || 1) - 1
        const limit = 20

        const filter: Filter = (req.query.filter || {}) as Filter

        const AND: Prisma.bidWhereInput[] = Object.entries(filter)
            .filter(([_,item]) => item?.value)
            .filter(([key]) => allowedColumnsToFilter.includes(key))
            .map(([key, { value, condition }]) => {
                if (key === 'company') {
                    const keywords = PROGRAMS.find(item => item.id === value)?.keywords

                    return {
                        OR: keywords?.map(keyword => ({
                            company: {
                                contains: keyword
                            }
                        }))
                    }
                }

                if (key === 'is_mentoria' || key === 'is_mastermiles') {
                    return {
                        [key]: value === "true" 
                    }
                }

                if (key === 'direction') {
                    return {
                        direction: value as bid_direction
                    }
                }
            
                return {}
            })
            
        const items = await db.bid.findMany({
            skip: page * limit,
            take: limit,
            orderBy: {
                'created_at': 'desc'
            },
            where: {
                AND
            }
        })

        const total = await db.bid.count({
            where: {
                AND
            },
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