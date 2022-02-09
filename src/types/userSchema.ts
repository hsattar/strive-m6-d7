import { Model } from "mongoose"

export interface IUser {
    firstName: String
    lastName: String
    avatar: String
    email: String
    password: String
    role: String
    createdAt: Date
    updatedAt: Date
}

export interface IUserModel extends Model<IUser> {
    authenticate(email: string, password: string): any
}