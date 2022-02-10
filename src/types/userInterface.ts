import { Model, Document, Types } from "mongoose"

export interface TokenDetails {
    _id: string
    role?: string
}

export interface IUser {
    _id: Types.ObjectId
    firstName: string
    lastName: string
    avatar: string
    email: string
    password: string
    role: string
    refreshToken: string
    createdAt: Date
    updatedAt: Date
}

export type IUserDoc = IUser & Document 

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUser | null
}