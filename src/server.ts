import express from 'express'
import cors from 'cors'
import passport from 'passport'
import mongoose from 'mongoose'
import blogRouter from './routes/blogs'
import userRouter from './routes/users'
import googleStrategy from './utils/oauth'
import { errorHandlers } from './middleware/errorHandlers'
import { authenticateUser } from './middleware/authentication'
import meRouter from './routes/me'

const { PORT, DB_CONNECTION } = process.env

const server = express()
passport.use('google', googleStrategy)

server.use(express.json())
server.use(cors())
server.use(passport.initialize())

server.use('/users', userRouter)
server.use('/me', authenticateUser, meRouter)
server.use('/blogs', authenticateUser, blogRouter)

server.use(errorHandlers)

mongoose.connect(DB_CONNECTION!)

mongoose.connection.on('connected', () => {
    console.log('DB Connected')
    server.listen(PORT!, () => {
        console.log(`Server running on port ${PORT}`)
    })
})

mongoose.connection.on('error', err => console.log('DB Connection Failed', err))