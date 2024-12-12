import dotenv from 'dotenv';
import { pool } from "../helpers/db.js";
import { insertFavorite, getFavorite, removeUserFavorite } from '../models/Favorites.js';

dotenv.config()

const postUserFavorite = async (req, res,next) => {
    //const { idUser, idMovie, title } = req.body;
    //const exists = testFavorites.some(fav => fav.idUser === idUser && fav.idMovie === idMovie);
    try{
        const result = await insertFavorite(req.body.idUser,req.body.idMovie,req.body.title,req.body.img_path);
        //res.status(201).send('movie added to favorites');
        //console.log(testFavorites);
        return res.status(200).json(result.rows)
    } catch {
        res.status(400).send('Movie already in favorites');
        console.log('Movie already in favorites');
    }
}

const getUserFavorite = async (req,res,next) => {
    const userId = parseInt(req.params.userId)
    try {
        console.log('getuserfav params: '+req.params.userId)
        const result = await getFavorite(userId)
        return res.status(200).json(result.rows)
    } catch (error) {
        next(error)
    }
}

const deleteUserFavorite = async(req,res,next) => {
    const userId = parseInt(req.params.userId)
    const idMovie = parseInt(req.params.idMovie)
    try {
        const result = removeUserFavorite(userId,idMovie)
        return res.status(200).json(result.rows)
    } catch (error) {
        next(error)
    }
}

export { postUserFavorite, getUserFavorite, deleteUserFavorite }