import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { NextFunction } from 'express'
import createHttpError from 'http-errors'
import { IUser, IUserModel } from '../types/userInterface'
import blogSchema from './blogSchema'

const { Schema, model } = mongoose

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: String,
    email: {  type: String, required: true, unique: true },
    password: String,
    googleId: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshToken: String,
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }]
}, { timestamps: true })


userSchema.pre("save", async function (next: any) {
    try {
        console.log('you reached this point')
        
        if (this.isModified('password')) {
            const hash = await bcrypt.hash(this.password, 11)
            this.password = hash
        }

        if (this.isModified('firstName') || this.isModified('lastName')) {
            this.avatar = `https://ui-avatars.com/api/?name=${this.firstName}+${this.lastName}`
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
        const user: IUser = await this.findOne({ email })
        if (!user) return null
        const pwMatch = await bcrypt.compare(password, user.password!)
        if (!pwMatch) return null
        return user
    } catch (error) {
        createHttpError(500, 'Server Error')
    }
}

export default model<IUser, IUserModel>('User', userSchema)