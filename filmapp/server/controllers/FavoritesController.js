import dotenv from 'dotenv';
import { pool } from "../helpers/db.js";
import { insertFavorite, getFavorite, removeUserFavorite } from '../models/Favorites.js';
import { ApiError } from "../helpers/ApiError.js";

dotenv.config()

const postUserFavorite = async (req, res,next) => {

    try{
        if (!req.body.idMovie || req.body.idMovie.length === 0) return next(new ApiError('movie not found',400))
        const result = await insertFavorite(req.body.idUser,req.body.idMovie,req.body.title,req.body.img_path);
        return res.status(200).json(result.rows)
    } catch (error) {
        next(error)
    }
}

const getUserFavorite = async (req,res,next) => {
    const userId = parseInt(req.params.userId)
    try {
        if (!userId) return next(new ApiError('user not found'))
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
        if (!userId) return next(new ApiError('user not found'))
        if (!idMovie) return next(new ApiError('movie not found'))
        const result = removeUserFavorite(userId,idMovie)
        return res.status(200).json(result.rows)
    } catch (error) {
        next(error)
    }
}

export { postUserFavorite, getUserFavorite, deleteUserFavorite }