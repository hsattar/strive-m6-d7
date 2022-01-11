import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const { PORT, DB_CONNECTION } = process.env

const server = express()

server.use(express.json())
server.use(cors())

mongoose.connect(DB_CONNECTION)

mongoose.connection.on('connected', () => {
    console.log('DB Connected')
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})

mongoose.connection.on('error', err => console.log('DB Connection Failed', err))