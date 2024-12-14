import dotenv from 'dotenv';
import { insertFavorite, getFavoriteByUserId, removeUserFavorite } from '../models/Favorites.js';
import { ApiError } from "../helpers/ApiError.js";
dotenv.config();

const postUserFavorite = async (req, res, next) => {
    try {
        const { idUser, idMovie, title } = req.body;
        if (!idMovie || idMovie.length === 0) return next(new ApiError('movie not found', 400));
        const result = await insertFavorite(idUser, idMovie, title);
        if (result.rowCount === 0) {
            return res.status(400).json({ message: 'Movie already in favorites' });
        }
        return res.status(201).json(result.rows);
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