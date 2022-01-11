import express from 'express'
import cors from 'cors'
import Mongoose from 'mongoose'

const server = express()

server.use(express.json())
server.use(cors())

