import { Router } from 'express'
import BlogModal from '../db-models/blogSchema.js'
import createHttpError from 'http-errors'
import { blogBodyValidator } from '../middleware/validation.js'
import { validationResult } from 'express-validator'

const blogRouter = Router()

blogRouter.route('/')
.get(async (req, res, next) => {
    try {
        const blogs = await BlogModal.find()
        res.send(blogs)
    } catch (error) {
        next(error)
    }
})
.post(blogBodyValidator, async (req, res, next) => {
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

blogRouter.route('/:blogId')
.get(async (req, res, next) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findById(req.params.blogId)
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        next(error)
    }
})
.put(async (req, res, next) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, req.body, { new: true })
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const deleteBlog = await BlogModal.findByIdAndDelete(req.params.blogId)
        if (!deleteBlog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

blogRouter.route('/:blogId/comments')
.get(async (req, res, next) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findById(req.params.blogId, { comments: 1, _id: 0 })
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))    
        res.send(blog.comments)
    } catch (error) {
        next(error)
    }
})
.post(async (req, res, next) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, { $push: { comments: req.body} }, { new: true })
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

blogRouter.route('/:blogId/comments/:commentId')
.get(async (req, res, next) => {
    try {
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid Blog ID'))
        if (req.params.commentId.length !== 24) return next(createHttpError(400, 'Invalid Comment ID'))
        const blogComments = await BlogModal.findById(req.params.blogId, { comments: 1, _id: 0 })
        if (!blogComments) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        const blogComment = blogComments.comments.find(({ _id }) => _id.toString() === req.params.commentId)
        if (!blogComment) return next(createHttpError(400, `The id ${req.params.commentId} does not match any comments`))
        res.send(blogComment)
    } catch (error) {
        next(error)
    }
})
.put(async (req, res, next) => {
    try {
        res.send('PUT')
    } catch (error) {
        next(error)
    }
})
.delete(async (req, res, next) => {
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

export default blogRouter