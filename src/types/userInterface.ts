import { Model, Document } from "mongoose"

export interface IUser {
    firstName: string
    lastName: string
    avatar: string
    email: string
    password: string
    role: string
    createdAt: Date
    updatedAt: Date
}

export type IUserDoc = IUser & Document 
// export type IUserDoc = <Type extends Document>

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): IUser | null
}