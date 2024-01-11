import { Request, Response } from "express";
import { db } from "../db";
import { INTERNAL_ERROR } from "@balcao-de-milhas/validations";

export const createDeviceController = async (req: Request, res: Response) => {
    try {
        await db.device.upsert({
            where: {
                push_token: req.body.push_token,
            },
            update: {
                device_info: req.body.device_info,
                build_id: req.body.build_id,
            },
            create: {
                build_id: req.body.build_id,
                device_info: req.body.device_info,
                push_token: req.body.push_token
            }
        })

        return res.status(201).end()
    } catch (e) {
        return res.status(500).json({
            message: INTERNAL_ERROR
        })
    }
}