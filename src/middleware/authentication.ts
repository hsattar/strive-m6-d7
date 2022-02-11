import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import { verifyJWTToken } from "../utils/jwt"

const { JWT_ACCESS_TOKEN_SECRET: ACCESS_SECRET } = process.env

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.cookies.accessToken) return next(createHttpError(401, 'No Authorization provided'))
        const payload = await verifyJWTToken(req.cookies.accessToken, ACCESS_SECRET!)
        if (!payload) return next(createHttpError(401, 'Invalid details'))
        req.user = payload
        next()
    } catch (error) {
        next(error)
    }
}