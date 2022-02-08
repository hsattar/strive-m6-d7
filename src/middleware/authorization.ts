import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"

export const adminOnly = async (req: any, res: Response, next: NextFunction) => {
    if (req.user.role === 'user') return next(createHttpError(403, 'You are not authorized to do this'))
    next()
}