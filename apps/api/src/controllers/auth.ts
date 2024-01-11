import { HttpStatusCode } from 'axios';
import { Request, Response } from "express";
import { db } from "../db";
import jwt from 'jsonwebtoken'
import {config} from 'dotenv'

config()

export const signInController = async (req: Request, res: Response) => {
    try {
        const password = req.body.password
        
        if (password === process.env.ADMIN_SECRET_KEY) {
            return res.json({
                token: jwt.sign({}, process.env.JWT_SECRET as string, {
                    expiresIn: '1h'
                })
            })
        } else {
            return res.status(HttpStatusCode.Forbidden).json({
                message: 'Senha incorreta.'
            })
        }
    } catch (e) {
        return res.status(HttpStatusCode.InternalServerError).json({
            message: 'Erro interno. Entre em contato com o administrador do sistema.'
        })
    }
}