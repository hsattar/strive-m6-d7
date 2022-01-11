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

blogRouter.route('/:id')
.get(async (req, res, next) => {
    try {
        res.send('GET ID')
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
        res.send('DELETE')
    } catch (error) {
        next(error)
    }
})

export default blogRouter