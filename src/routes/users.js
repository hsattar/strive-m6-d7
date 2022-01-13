import { Router } from 'express'
import UserModal from '../db-models/userSchema.js'

const userRouter = Router()

userRouter.route('/')
.get(async (req, res, next) => {
    try {
        const users = await UserModal.find()
        res.send(users)
    } catch (error) {
        next(error)
    }
})
.post(async (req, res, next) => {
    try {
        const newUser = new UserModal(req.body)
        newUser.save()
        res.send(newUser)
    } catch (error) {
        next(error)
    }
})

userRouter.route('/:userId')
.get(async (req, res, next) => {
    try {
        const user = await UserModal.findById(req.params.userId)
        res.send(user)
    } catch (error) {
        console.log(error)
        next(error)
    }
})
.put(async (req, res, next) => {
    try {
        const updatedUser = await UserModal.findByIdAndUpdate(req.params.userId, req.body, { new: true })
        res.send(updatedUser)
    } catch (error) {
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        const result = await UserModal.findByIdAndDelete(req.params.userId)
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default userRouter