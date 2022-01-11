import { Router } from 'express'
import BlogModal from '../db-models/blogSchema.js'

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
.post(async (req, res, next) => {
    try {
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
        const blog = await BlogModal.findById(req.params.blogId)
        res.send(blog)
    } catch (error) {
        next(error)
    }
})
.put(async (req, res, next) => {
    try {
        const blog = await BlogModal.findByIdAndUpdate(req.params.blogId, req.body, { new: true })
        res.send(blog)
    } catch (error) {
        next(error)
    }
})
.delete(async (req, res, next) => {
    try {
        const deleteBlog = await BlogModal.findByIdAndDelete(req.params.blogId)
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})

export default blogRouter