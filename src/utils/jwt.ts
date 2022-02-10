import jwt from 'jsonwebtoken'

interface Payload {
    _id: string
    role?: string
}

export const generateJWTToken = (payload: Payload, secret: string, expiresIn: string) => new Promise((resolve, reject) => 
jwt.sign(payload, secret, { expiresIn }, (err, token) => {
    if (err) reject(err)
    resolve(token)
}))