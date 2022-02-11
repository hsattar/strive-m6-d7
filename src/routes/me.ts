import { NextFunction, Request, Response, Router } from 'express'
import createHttpError from 'http-errors'
import UserModal from '../db-models/userSchema'

const meRouter = Router()

meRouter.route('/')
.get(async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await UserModal.findById(req.user._id, { refreshToken: 0 })
        res.send(user)
    } catch (error) {
        next(error)
    }
})
.put(async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await UserModal.findById(req.user._id)
        if (!user) return next(createHttpError(404, 'User not found'))
        user.password = req.body.password
        await user.save()
        res.send(user)
    } catch (error) {
        next(error)
    }
})
.delete(async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await UserModal.findByIdAndDelete(req.user._id)
        if (!user) return next(createHttpError(404, 'User not found'))
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

meRouter.route('/blogs')
.get(async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await UserModal.findById(req.user._id, { refreshToken: 0 })
        .populate('blogs')
        res.send(user.blogs)
    } catch (error) {
        next(error)
    }
})

export default meRouter