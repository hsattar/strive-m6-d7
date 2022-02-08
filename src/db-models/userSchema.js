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

userSchema.statics.authenticate = async function(email, password) {
    try {
        const user = await this.findOne({ email })
        if (!user) return null
        const pwMatch = await bcrypt.compare(password, user.password)
        if (!pwMatch) return null
        return user
    } catch (error) {
        next(error)
    }
}

export default model('User', userSchema)