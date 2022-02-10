import { Types } from "mongoose"

export interface IBlogs {
    _id: Types.ObjectId
    category: string
    title: string
    cover: string
    readTime: IReadTime
    author: Types.ObjectId
    content: string
    likes: Types.ObjectId[]
    comments: IComment[]
    createdAt: Date
    updatedAt: Date
}

export interface IReadTime {
    value: number
    unit: string
}

export interface IComment {
    id: string
    author: Types.ObjectId
    comment: string
    rating: number
}