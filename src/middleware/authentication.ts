import { NextFunction, Request, Response } from "express"
import createHttpError from "http-errors"
import atob from 'atob'
import UserModal from '../db-models/userSchema'

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization) return next(createHttpError(401, 'No Authorization provided'))
        const encodedDetails = req.headers.authorization.split(' ')[1]
        const authDetails = atob(encodedDetails)
        const [email, password] = authDetails.split(':')
        const user = await UserModal.authenticate(email, password)
        if (!user) return next(createHttpError(401, 'Invalid details'))
        req.user = user
        next()
    } catch (error) {
        next(error)
    }
}