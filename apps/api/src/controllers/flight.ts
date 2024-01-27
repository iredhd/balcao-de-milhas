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

export const getFlightsController = async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page || 1) - 1
        const limit = 20

        const items = await db.flight.findMany({
            skip: page * limit,
            take: limit,
            orderBy: {
                'created_at': 'desc'
            },
            select: {
                id: true,
                created_at: true,
                text: true
            }
        })

        const total = await db.flight.count({
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

export const getFlightFileController = async (req: Request, res: Response) => {
    try {
        const flightId = Number(req.params.id)

        const flight = await db.flight.findUnique({
            where: {
                id: flightId
            }
        })

        if (flight?.file) {
            return res.download(flight?.file)
        }

        return res.status(HttpStatusCode.Forbidden).json()
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}