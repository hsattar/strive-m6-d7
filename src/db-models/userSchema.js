import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: String,
    email: {  type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
}, { timestamps: true })



export default model('User', userSchema)