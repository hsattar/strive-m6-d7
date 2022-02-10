import { NextFunction, Request, Response, Router } from 'express'
import BlogModal from '../db-models/blogSchema'

const meRouter = Router()

meRouter.route('/')
.get(async (req: Request, res: Response, next: NextFunction) => {
    res.send(req.user)
})
.put(async (req: any, res: Response, next: NextFunction) => {
    try {
        req.user.firstName = req.body.firstName || req.user.firstName
        req.user.lastName = req.body.lastName || req.user.lastName
        req.user.email = req.body.email || req.user.email
        await req.user.save()
        res.send(req.user)
    } catch (error) {
        next(error)
    }
})
.delete(async (req: any, res: Response, next: NextFunction) => {
    try {
        await req.user.deleteOne()
        res.status(204).send()
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