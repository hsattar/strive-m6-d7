import createHttpError from "http-errors"

export const adminOnly = async (req, res, next) => {
    if (req.user.role === 'user') return next(createHttpError(403, 'You are not authorized to do this'))
    next()
}