import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";
import morgan from "morgan";

export const createDeviceController = async (req: Request, res: Response) => {
    try {
        await db.device.upsert({
            where: {
                push_token: req.body.push_token,
            },
            update: {
                device_info: req.body.device_info,
                // build_id: req.body.build_id,
            },
            create: {
                // build_id: req.body.build_id,
                device_info: req.body.device_info,
                push_token: req.body.push_token
            }
        })

        return res.status(201).json()
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}

export const createFlightsAppDeviceController = async (req: Request, res: Response) => {
    try {
        await db.flights_app_device.upsert({
            where: {
                device_id: req.body.device_id
            },
            update: {
                last_ip: req.ip || req.socket.remoteAddress || '',
                last_use_at: new Date(),
            },
            create: {
                push_token: req.body.push_token,
                active: true,
                last_ip: req.ip || req.socket.remoteAddress || '',
                last_use_at: new Date(),
                brand: req.body.device_info.brand,
                device_id: req.body.device_id,
                device_info: req.body.device_info,
                model: req.body.device_info.modelName,
                os: req.body.device_info.osName
            }
        })

        return res.status(201).json()
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}