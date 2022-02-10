import { NextFunction, Request, Response, Router } from 'express'
import createHttpError from 'http-errors'
import UserModal from '../db-models/userSchema'

const meRouter = Router()

meRouter.route('/')
.get(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModal.findById(req.user._id)
        res.send(user)
    } catch (error) {
        next(error)
    }
})
.put(async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = await UserModal.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
        if (!user) return next(createHttpError(404, 'User not found'))
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

// meRouter.route('/blogs')
// .get(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const blogs = await BlogModal.find()
//         .populate<{author: { email: string }[]}>('author', 'email')
//         const myBlogs = blogs.filter(blog => blog.author[0].email  === req.user.email)
//         res.send(myBlogs)
//     } catch (error) {
//         next(error)
//     }
// })

export default meRouter