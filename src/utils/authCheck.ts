import { IBlogs, IComment } from "../types/blogInterface"
import { TokenDetails } from "../types/userInterface"

export const userCreatorOrAdmin = (user: TokenDetails, resource: IBlogs | IComment) => {
    if (resource.author._id.toString() === user._id) return true
    return false
}