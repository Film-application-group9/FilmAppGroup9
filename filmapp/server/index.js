import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import showtimeRouter from "./routers/showtimeRouter.js"

const port = 3001

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/', showtimeRouter)




app.listen(port)