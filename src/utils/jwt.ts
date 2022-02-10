import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import { IUserDoc } from '../types/userInterface'
import UserModal from '../db-models/userSchema'

interface Payload {
    _id: string
    role?: string
}

const { JWT_ACCESS_TOKEN_SECRET: ACCESS_SECRET, JWT_REFRESH_TOKEN_SECRET: REFRESH_SECRET } = process.env

export const createNewTokens = async (user: IUserDoc) => {
    const accessToken = await generateJWTToken({ _id: user._id.toString(), role: user.role}, ACCESS_SECRET!, '15 m')
    const refreshToken = await generateJWTToken({ _id: user._id.toString()}, REFRESH_SECRET!, '1 week')
    user.refreshToken = refreshToken as string
    await user.save()
    return { accessToken, refreshToken }
}

const generateJWTToken = (payload: Payload, secret: string, expiresIn: string): Promise<string> => new Promise((resolve, reject) => 
jwt.sign(payload, secret, { expiresIn }, (err, token) => {
    if (err) reject(err)
    resolve(token as string)
}))

export const verifyJWTToken = (token: string, secret: string): Promise<Payload> => new Promise((resolve, reject) =>
jwt.verify(token, secret, (err, payload) => {
    if (err) reject(err)
    resolve(payload as Payload)
}))

export const verifyRefreshTokenAndGenerateNewTokens = async (token: string) => {
    try {
        const { _id } = await verifyJWTToken(token, REFRESH_SECRET!)
        if (!_id) throw createHttpError(401, 'Invalid Token')
        const user = await UserModal.findById(_id)
        if (!user) throw createHttpError(404, 'User not found')
        if (!user.refreshToken || user.refreshToken !== token) throw createHttpError(401, 'Invalid Token')
        const { accessToken, refreshToken } = await createNewTokens(user)
        return { accessToken, refreshToken }
    } catch (error) {
        throw createHttpError(401, 'Ivalid Details')
    }
}