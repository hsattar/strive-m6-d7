import jwt from 'jsonwebtoken'
import { IUserDoc } from '../types/userInterface'

interface Payload {
    _id: string
    role?: string
}

const { JWT_ACCESS_TOKEN_SECRET: ACCESS_SECRET, JWT_REFRESH_TOKEN_SECRET: REFRESH_SECRET } = process.env

export const createNewTokens = async (user: IUserDoc) => {
    const accessToken = await generateJWTToken({ _id: user._id.toString(), role: user.role}, ACCESS_SECRET!, '15 m')
    const refreshToken = await generateJWTToken({ _id: user._id.toString()}, REFRESH_SECRET!, '1 week')
    user.refreshhToken = refreshToken as string
    await user.save()
    return { accessToken, refreshToken }
}

const generateJWTToken = (payload: Payload, secret: string, expiresIn: string) => new Promise((resolve, reject) => 
jwt.sign(payload, secret, { expiresIn }, (err, token) => {
    if (err) reject(err)
    resolve(token)
}))

export const verifyJWTToken = (token: string, secret: string) => new Promise((resolve, reject) =>
jwt.verify(token, secret, (err, payload) => {
    if (err) reject(err)
    resolve(payload)
}))

export const verifyRefreshTokenAndGenerateNewTokens = async (token: string) => {
    try {
        
    } catch (error) {
        
    }
}