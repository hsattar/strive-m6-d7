import { Model, Document, Types } from "mongoose"

export interface TokenDetails {
    _id: Types.ObjectId
    role: string
}

export interface IUser extends TokenDetails {
    firstName: string
    lastName: string
    avatar: string
    email: string
    password: string
    refreshhToken: string
    createdAt: Date
    updatedAt: Date
}

export type IUserDoc = IUser & Document 

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUser | null
}