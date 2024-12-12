import express from 'express';
import cors from 'cors'
import dotenv from "dotenv";
import pkg from 'pg';

import userRouter from './routers/userRouter.js';
import {searchHandler} from "./search.js";
import { postUserFavorite, getUserFavorites, deleteUserFavorite } from "./favorites.js";
import groupsRouter from './routers/groupsRouter.js'

import reviewRouter from './routers/reviewRouter.js'

const environment = process.env.NODE_ENV

dotenv.config();
const apiKey = process.env.TMDB_API_KEY;
const port = process.env.PORT
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/user',userRouter)
app.use('/review', reviewRouter)
app.use('/groups',groupsRouter)
app.get('/search', searchHandler(apiKey));
app.post('/favorites', postUserFavorite );
app.get('/favorites/:idUser', getUserFavorites);
app.delete('/favorites/delete/:idUser/:idMovie', deleteUserFavorite);
app.listen(port);

export default app











