import express from 'express';
import cors from 'cors'
import pkg from 'pg'
import dotenv from 'dotenv'
import userRouter from './routers/userRouter.js'

const port = process.env.PORT
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/user',userRouter)

app.listen(port)