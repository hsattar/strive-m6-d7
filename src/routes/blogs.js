import { Router } from 'express'
import BlogModal from '../db-models/blogSchema.js'
import createHttpError from 'http-errors'
import { blogBodyValidator } from '../middleware/validation.js'
import { validationResult } from 'express-validator'
import q2m from 'query-to-mongo'

const blogRouter = Router()

blogRouter.route('/')
.get(async (req, res, next) => {
    try {
        const query = q2m(req.query)
        const blogs = await BlogModal.find(query.criteria, query.options.fields)
        .sort(query.options.sort)
        .skip(query.options.skip)
        .limit(query.options.limit)
        .populate('author', 'firstName lastName avatar')
        .populate('likes')
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
        const blog = await BlogModal.findById(req.params.blogId).populate('author', 'firstName lastName avatar')
        if (!blog) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        res.send(blog)
    } catch (error) {
        console.log(error)
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
        if (req.params.blogId.length !== 24) return next(createHttpError(400, 'Invalid Blog ID'))
        if (req.params.commentId.length !== 24) return next(createHttpError(400, 'Invalid Comment ID'))
        const blogs = await BlogModal.findById(req.params.blogId)
        if (!blogs) return next(createHttpError(400, `The id ${req.params.blogId} does not match any blogs`))
        const commentIndex = blogs.comments.findIndex(({ _id }) => _id.toString() === req.params.commentId)
        if (!commentIndex) return next(createHttpError(400, `The id ${req.params.commentId} does not match any comments`))
        blogs.comments[commentIndex] = { ...blogs.comments[commentIndex].toObject(), ...req.body }
        await blogs.save()
        res.send(blogs.comments[commentIndex])
    } catch (error) {
        console.log(error)
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