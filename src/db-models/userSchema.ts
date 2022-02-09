import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { NextFunction } from 'express'
import createHttpError from 'http-errors'
import { IUser, IUserModel } from '../types/userSchema'

const { Schema, model } = mongoose

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: String,
    email: {  type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
}, { timestamps: true })


userSchema.pre("save", async function (this: any, next: any) {
    const user = this
    try {
        if (user.isModified('password')) {
            const hash = await bcrypt.hash(user.password, 11)
            user.password = hash
        }

        if (user.isModified('firstName') || user.isModified('lastName')) {
            user.avatar = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`
        }

        next()
    } catch (error) {
        next(error)
    }
})


userSchema.methods.toJSON = function() {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.__v
    return userObject
}

userSchema.statics.authenticate = async function(email: string, password: string) {
    try {
        const user = await this.findOne({ email })
        if (!user) return null
        const pwMatch = await bcrypt.compare(password, user.password)
        if (!pwMatch) return null
        return user
    } catch (error) {
        createHttpError(500, 'Server Error')
    }
}

export default model<IUser, IUserModel>('User', userSchema)