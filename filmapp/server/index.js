import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import pkg from 'pg';

import userRouter from './routers/userRouter.js';
import favoritesRouter from './routers/favoritesRouter.js';
import groupsRouter from './routers/groupsRouter.js';
import reviewRouter from './routers/reviewRouter.js';
import profileRouter from './routers/profileRouter.js';
import { searchHandler } from "./controllers/SearchController.js";

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
app.use('/favorites', favoritesRouter);

app.get('/search', searchHandler(apiKey));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

export default app;