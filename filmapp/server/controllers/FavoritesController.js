import dotenv from 'dotenv';
import { pool } from "../helpers/db.js";
import { insertFavorite, getFavorite } from '../models/Favorites.js';

dotenv.config()

const postUserFavorite = async (req, res,next) => {
    //const { idUser, idMovie, title } = req.body;
    //const exists = testFavorites.some(fav => fav.idUser === idUser && fav.idMovie === idMovie);
    try{
        const result = await insertFavorite(req.body.idUser,req.body.idMovie,req.body.title);
        //res.status(201).send('movie added to favorites');
        //console.log(testFavorites);
        return res.status(200).json(result.rows)
    } catch {
        res.status(400).send('Movie already in favorites');
        console.log('Movie already in favorites');
    }
}

export { postUserFavorite }