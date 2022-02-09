import { Types } from "mongoose"

export interface IBlogs {
    category: string
    title: string
    cover: string
    readTime: IReadTime
    author: Types.ObjectId[]
    content: string
    likes: Types.ObjectId[]
    comments: IComments[]
    createdAt: Date
    updatedAt: Date
}

export interface IReadTime {
    value: number
    unit: string
}

export interface IComments {
    id: string
    comment: string
    rating: number
}