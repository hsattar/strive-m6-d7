import { NextFunction, Request, Response, Router } from 'express'
import BlogModal from '../db-models/blogSchema'
import createHttpError from 'http-errors'
import { blogBodyValidator } from '../middleware/validation'
import { validationResult } from 'express-validator'
import q2m from 'query-to-mongo'
import { blogData } from '../data/blogData'
import { adminOnly } from '../middleware/authorization'
import blogCommentsRouter from './blogComments'

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

blogRouter.post('/add-many-blogs', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blogs = await BlogModal.insertMany(blogData, { ordered: false })
        res.send(blogs)
    } catch (error) {
        next(error)
    }
})

blogRouter.delete('/delete-old-blogs', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await BlogModal.deleteMany({"author.name": { $exists: true }})
        res.status(200).send(`Deleted ${result} Blogs`)
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
.put(adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, req.body, { new: true })
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        next(error)
    }
})
.delete(adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const deleteBlog = await BlogModal.findByIdAndDelete(req.params.blogId)
        if (!deleteBlog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

blogRouter.post('/:blogId/add-like', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, { $push: { likes: req.body.userId } }, { new: true })
        res.send(blog)
    } catch (error) {
        next(error)
    }
})

blogRouter.use('/:blogId/comments', blogCommentsRouter)

export default blogRouter