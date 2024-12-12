import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import pkg from 'pg';

import userRouter from './routers/userRouter.js';
import {searchHandler} from "./search.js";
//import { postUserFavorite, getUserFavorites, deleteUserFavorite } from "./favorites.js";
//import { postUserFavorite } from './controllers/FavoritesController.js';
import groupsRouter from './routers/groupsRouter.js'

import reviewRouter from './routers/reviewRouter.js'

import favoritesRouter from './routers/favoritesRouter.js'


import { searchHandler } from "./controllers/searchController.js";
import { postUserFavorite, getUserFavorites, deleteUserFavorite } from "./favorites.js";
import groupsRouter from './routers/groupsRouter.js';
import reviewRouter from './routers/reviewRouter.js';
import profileRouter from './routers/profileRouter.js';

dotenv.config();
const apiKey = process.env.TMDB_API_KEY;
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/user', userRouter);
app.use('/review', reviewRouter);
app.use('/groups', groupsRouter);
app.use('/profiles', profileRouter);
app.get('/search', searchHandler(apiKey));
app.post('/favorites', postUserFavorite);
app.get('/favorites/:idUser', getUserFavorites);
app.delete('/favorites/delete/:idUser/:idMovie', deleteUserFavorite);
<<<<<<< HEAD

app.listen(port);












=======
app.listen(port);
>>>>>>> 4ab7dc291cd9d2bd1b66d87bf39e314e388f12bd
