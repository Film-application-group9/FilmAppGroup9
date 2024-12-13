import { pool } from "../helpers/db.js";

const insertFavorite = async(idUser, idMovie, title, img_path) => {
    return await pool.query('insert into favorites (id_user,id_movie,moviename,img_path) values ($1,$2,$3,$4) returning *',[idUser,idMovie,title,img_path])
}

const getFavorite = async(userId) => {
    return await pool.query('SELECT * from favorites WHERE id_user=$1',[userId])
}

const removeUserFavorite = async(userId,idMovie) => {
    return await pool.query('delete from favorites where id_user=$1 and id_movie=$2 returning id_movie',[userId,idMovie])
}

export {insertFavorite, getFavorite, removeUserFavorite }