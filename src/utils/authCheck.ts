import { IBlogs } from "../types/blogInterface"
import { TokenDetails } from "../types/userInterface"

export const userCreatorOrAdmin = (user: TokenDetails, blog: IBlogs) => {
    const index = blog.author.findIndex(author => author._id.toString() === user._id)
    if (index === -1) return false
    return true
}