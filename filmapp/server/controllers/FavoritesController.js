import dotenv from 'dotenv';
import { insertFavorite, getFavoriteByUserId, removeUserFavorite } from '../models/Favorites.js';
import { ApiError } from "../helpers/ApiError.js";
dotenv.config();

const postUserFavorite = async (req, res, next) => {
    try {
        //const { idUser, idMovie, title, imgPath } = req.body;
        //if (!idMovie || idMovie.length === 0) return next(new ApiError('movie not found', 400));
        if (!req.body.idMovie || req.body.idMovie.length === 0) return next(new ApiError('movie not found',400))
        const result = await insertFavorite(req.body.idUser,req.body.idMovie,req.body.title,req.body.img_path);
        return res.status(200).json(result.rows)
    } catch (error) {
        next(error);
    }
};

const getUserFavorite = async (req, res, next) => {
    const { idUser } = req.params;
    try {
        if (!idUser) return next(new ApiError('user ID not found'));
        console.log(`Fetching favorites for user ID: ${idUser}`); 
        const result = await getFavoriteByUserId(idUser);
        console.log(`Favorites fetched: ${JSON.stringify(result.rows)}`); 
        return res.status(200).json({ idUser, favorites: result.rows });
    } catch (error) {
        console.error('Error fetching favorites:', error); 
        next(error);
    }
};

const deleteUserFavorite = async (req, res, next) => {
    const { idUser, idMovie } = req.params;
    try {
        if (!idUser) return next(new ApiError('user ID not found'));
        if (!idMovie) return next(new ApiError('movie not found'));
        const result = await removeUserFavorite(idUser, idMovie);
        return res.status(200).json(result.rows);
    } catch (error) {
        next(error);
    }
};

export { postUserFavorite, getUserFavorite, deleteUserFavorite };