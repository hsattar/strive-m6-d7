import { Model, Document, Types } from "mongoose"

export interface IUser {
    _id: Types.ObjectId
    firstName: string
    lastName: string
    avatar: string
    email: string
    password: string
    role: string
    refreshhToken: string
    createdAt: Date
    updatedAt: Date
}

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUser | null
}