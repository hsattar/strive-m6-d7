import { NextFunction, Request, Response, Router } from 'express'
import UserModal from '../db-models/userSchema'
import { userCreationValidator } from '../middleware/validation'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { authenticateUser } from '../middleware/authentication'
import { adminOnly } from '../middleware/authorization'
import { createNewTokens, verifyRefreshTokenAndGenerateNewTokens } from '../utils/jwt'
import { IUserDoc } from '../types/userInterface'
import passport from 'passport'

const userRouter = Router()

userRouter.route('/')
.get(authenticateUser, adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserModal.find({}, { refreshToken: 0 })
        res.send(users)
    } catch (error) {
        next(error)
    }
})
.post(userCreationValidator, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return next(createHttpError(400, errors))
        const newUser = new UserModal(req.body)
        await newUser.save()
        res.send(newUser)
    } catch (error) {
        next(error)
    }
})

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        const user = await UserModal.authenticate(email, password)
        if (!user) return next(createHttpError(401, `Invalid Details`))
        const { accessToken, refreshToken } = await createNewTokens(user as IUserDoc)
        res.send({ accessToken, refreshToken })
    } catch (error) {
        next(error)
    }
})

userRouter.post('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body
        const { accessToken, refreshToken } = await verifyRefreshTokenAndGenerateNewTokens(token)
        res.send({ accessToken, refreshToken })
    } catch (error) {
        next(error)
    }
})

userRouter.get('/googleLogin', passport.authenticate('google', { scope: ['email', 'profile'] }))

userRouter.get('/googleRedirect', passport.authenticate('google'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        next(error)
    }
})

userRouter.route('/:userId')
.get(authenticateUser, adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.userId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const user = await UserModal.findById(req.params.userId, { refreshToken: 0 })
        if (!user) return next(createHttpError(400, `The id ${req.params.userId} does not match any users`))
        res.send(user)
    } catch (error) {
        next(error)
    }
})
.put(authenticateUser, adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.userId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const updatedUser = await UserModal.findByIdAndUpdate(req.params.userId, req.body, { new: true })
        if (!updatedUser) return next(createHttpError(400, `The id ${req.params.userId} does not match any users`))
        res.send(updatedUser)
    } catch (error) {
        next(error)
    }
})
.delete(authenticateUser, adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.params.userId.length !== 24) return next(createHttpError(400, 'Invalid ID'))
        const result = await UserModal.findByIdAndDelete(req.params.userId)
        if (!result) return next(createHttpError(400, `The id ${req.params.userId} does not match any users`))
        res.status(204).send()
    } catch (error) {
        next(error)
    }
})

export default userRouter