import mongoose from "mongoose"
import { IBlogs } from "../types/blogInterface"

const { Schema, model } = mongoose

const blogSchema = new Schema<IBlogs>({
    category: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    readTime: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }        
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    }]
}, { timestamps: true })

export default model<IBlogs>('Blog', blogSchema)