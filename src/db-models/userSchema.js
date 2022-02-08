import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema, model } = mongoose

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: String,
    email: {  type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
}, { timestamps: true })

userSchema.pre('save', async function(next) {
    try {
        if (this.isModified('password')) {
            const hash = await bcrypt.hash(this.password, 12)
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

export default model('User', userSchema)