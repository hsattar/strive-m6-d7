import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import { TokenDetails } from "../types/userInterface"
import { verifyJWTToken } from "../utils/jwt"

const { JWT_ACCESS_TOKEN_SECRET: ACCESS_SECRET, JWT_REFRESH_TOKEN_SECRET: REFRESH_SECRET } = process.env

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) return next(createHttpError(401, 'No Authorization provided'))
        const token = req.headers.authorization.split(' ')[1]
        const payload = await verifyJWTToken(token, ACCESS_SECRET!)
        if (!payload) return next(createHttpError(401, 'Invalid details'))
        req.user = payload as TokenDetails
        next()
    } catch (error) {
        next(error)
    }
}