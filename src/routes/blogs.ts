import { NextFunction, Request, Response, Router } from 'express'
import BlogModal from '../db-models/blogSchema'
import createHttpError from 'http-errors'
import { blogBodyValidator } from '../middleware/validation'
import { validationResult } from 'express-validator'
import q2m from 'query-to-mongo'
import { blogData } from '../data/blogData'
import { adminOnly } from '../middleware/authorization'
import blogCommentsRouter from './blogComments'
import { userCreatorOrAdmin } from '../utils/authCheck'

const blogRouter = Router({ mergeParams: true })

blogRouter.route('/')
.get(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = q2m(req.query)
        const blogs = await BlogModal.find(query.criteria, query.options.fields)
        .sort(query.options.sort)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .populate('author', 'firstName lastName')
        .populate('likes', 'firstName lastName')
        res.send(blogs)
    } catch (error) {
        next(error)
    }
})
.post(blogBodyValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return next(createHttpError(400, errors))
        const blog = new BlogModal(req.body)
        const newBlog = await blog.save()
        res.status(201).send(newBlog)
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/add-many-blogs', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await BlogModal.insertMany(blogData, { ordered: false })
        res.send(blogs)
    } catch (error) {
        next(error)
    }
})

blogRouter.route('/:blogId')
.get(async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findById(req.params.blogId).populate('author', 'firstName lastName avatar')
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        next(error)
    }
})
.put(async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const originalBlog = await BlogModal.findById(req.params.blogId)
        if (!originalBlog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        const editable = userCreatorOrAdmin(req.user, originalBlog)
        if (!editable) return next(createHttpError(401, 'You cannot edit this blog'))
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, req.body, { new: true, runValidators: true })
        res.send(blog)
    } catch (error) {
        next(error)
    }
})
.delete(async (req: any, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findById(req.params.blogId)
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        const deletable = userCreatorOrAdmin(req.user, blog)
        if (!deletable) return next(createHttpError(401, `You cannot delete this blog`))
        const deleted = await BlogModal.findByIdAndDelete(req.params.blogId)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/:blogId/add-like', async (req: any, res: Response, next: NextFunction) => {
    try {
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, { $push: { likes: req.user._id } }, { new: true })
        if (!blog) return next(createHttpError(404, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/:blogId/remove-like', async (req: any, res: Response, next: NextFunction) => {
    try {
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, { $pull: { likes: req.user._id } }, { new: true })
        if (!blog) return next(createHttpError(404, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        next(error)
    }
})

blogRouter.use('/:blogId/comments', blogCommentsRouter)

export default blogRouter