import mongoose from 'mongoose'

const { Schema, model } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true``
    },
    lastName: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    }
}, { timestamps: false })

export default model('User', userSchema)