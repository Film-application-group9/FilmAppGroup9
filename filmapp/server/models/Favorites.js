import { pool } from "../helpers/db.js";

const insertFavorite = async(idUser, idMovie, title) => {
    return await pool.query('insert into favorites (id_user,id_movie,moviename) values ($1,$2,$3) returning *',[idUser,idMovie,title])
}

const getFavorite = async(idUser) => {
    return await pool.query('select * from accounts where user_id=$1',[idUser])
}

const removeFavorite = async() => {

}

export {insertFavorite, getFavorite }