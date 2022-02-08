import { Router } from 'express'
import UserModal from '../db-models/userSchema.js'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { authenticateUser } from '../middleware/authentication.js'

const meRouter = Router()

meRouter.route('/')
.get(async (req, res, next) => {
    res.send(req.user)
})
.put(async (req, res, next) => {
    try {
        // req.user._doc = { ...req.user._doc, ...req.body }
        // res.send(req.user)
        // const updatedInfo = UserModal.findByIdAndUpdate(req.user._doc._id.toString(), req.body)
        // res.send(updatedInfo)
        req.user.firstName = req.body.firstName || req.user.firstName
        req.user.lastName = req.body.lastName || req.user.lastName
        req.user.email = req.body.email || req.user.email
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        await req.user.deleteOne()
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default meRouter