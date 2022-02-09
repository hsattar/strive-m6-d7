import { NextFunction, Request, Response, Router } from 'express'
import BlogModal from '../db-models/blogSchema'
import createHttpError from 'http-errors'
import { adminOnly } from '../middleware/authorization'
import { v4 as uuidv4 } from 'uuid'

const blogCommentsRouter = Router()

blogCommentsRouter.route('/')
.get(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findById(req.params.blogId, { comments: 1, _id: 0 })
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))    
        res.send(blog.comments)
    } catch (error) {
        next(error)
    }
})
.post(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, { $push: { comments: { ...req.body, id: uuidv4() }} }, { new: true })
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        next(error)
    }
})

blogCommentsRouter.route('/:commentId')
.get(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid Blog ID'))
        if (req.params.commentId.length !== 24) return next(createHttpError(400, 'Invalid Comment ID'))
        const blogComments = await BlogModal.findById(req.params.blogId, { comments: 1 })
        if (!blogComments) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        const blogComment = blogComments.comments.find(({ id }) => id === req.params.commentId)
        if (!blogComment) return next(createHttpError(400, `The id ${req.params.commentId} does not match any comments`))
        res.send(blogComment)
    } catch (error) {
        next(error)
    }
})
.put(adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid Blog ID'))
        if (req.params.commentId.length !== 24) return next(createHttpError(400, 'Invalid Comment ID'))
        const blogs = await BlogModal.findById(req.params.blogId)
        if (!blogs) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        const commentIndex = blogs.comments.findIndex(({ id }) => id === req.params.commentId)
        if (!commentIndex) return next(createHttpError(400, `The id ${req.params.commentId} does not match any comments`))
        blogs.comments[commentIndex] = { ...blogs.comments[commentIndex], ...req.body }
        await blogs.save()
        res.send(blogs.comments[commentIndex])
    } catch (error) {
        next(error)
    }
})
.delete(adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid Blog ID'))
        if (req.params.commentId.length !== 24) return next(createHttpError(400, 'Invalid Comment ID'))
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, { $pull: { comments: { _id: req.params.commentId } } }, { new: true })
        if (!blog) return next(createHttpError(400, `The id Blog or Comment ID does not match any blogs or comments for that blog`))
        res.send(blog)
    } catch (error) {
        next(error)
    }
})

export default blogCommentsRouter