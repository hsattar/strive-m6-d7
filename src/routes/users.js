import { Router } from 'express'
import UserModal from '../db-models/userSchema.js'
import { userCreationValidator } from '../middleware/validation.js'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { authenticateUser } from '../middleware/authentication.js'

const userRouter = Router()

userRouter.route('/')
.get(authenticateUser, async (req, res, next) => {
    try {
        const users = await UserModal.find()
        res.send(users)
    } catch (error) {
        next(error)
    }
})
.post(userCreationValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return next(createHttpError(400, errors))
        const newUser = new UserModal(req.body)
        await newUser.save()
        res.send(newUser)
    } catch (error) {
        next(error)
    }
})

userRouter.route('/:userId', authenticateUser)
.get(async (req, res, next) => {
    try {
        if (req.params.userId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const user = await UserModal.findById(req.params.userId)
        if (!user) return next(createHttpError(400, `The id ${req.params.userId} does not match any users`))
        res.send(user)
    } catch (error) {
        next(error)
    }
})
.put(async (req, res, next) => {
    try {
        if (req.params.userId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const updatedUser = await UserModal.findByIdAndUpdate(req.params.userId, req.body, { new: true })
        if (!updatedUser) return next(createHttpError(400, `The id ${req.params.userId} does not match any users`))
        res.send(updatedUser)
    } catch (error) {
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        if (req.params.userId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const result = await UserModal.findByIdAndDelete(req.params.userId)
        if (!result) return next(createHttpError(400, `The id ${req.params.userId} does not match any users`))
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default userRouter