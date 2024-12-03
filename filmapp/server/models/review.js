import { pool } from "../helpers/db.js";

const userEmail = async(id) => {
    return await pool.query('select username from accounts where id=$1', [id])
}
const reviewExists = async(idMovie, idUser) => {
    return await pool.query ("select *, to_char(date, 'DD.MM.YYYY HH24:MI:SS') from reviews INNER JOIN accounts ON reviews.id_user = accounts.id where id_movie=$1 AND id_user=$2;", [idMovie, idUser])
}

const insertReview = async (id_user, idmovie, moviename, stars, comment) => {
    return await pool.query("insert into reviews (id_user, id_movie, date, moviename, stars, comment) values ($1, $2, NOW(), $3, $4, $5)", [id_user,idmovie,moviename,stars, comment])
}

const deleteReview = async(idMovie, idUser) => {
    return await pool.query('delete from reviews where id_movie = $1 AND id_user = $2', [idMovie, idUser])
}

const updateReview = async (id_user, id_movie, moviename, stars, comment) => {
    return await pool.query("update reviews set moviename = $3, stars = $4, comment = $5, date=NOW() where id_user = $1, id_movie = $2", [id_user, id_movie, moviename, stars, comment])
}

const showAllReviews = async(idMovie) => {
    return await pool.query("select *, to_char(date, 'DD.MM.YYYY HH24:MI:SS') from reviews INNER JOIN accounts ON reviews.id_user = accounts.id where id_movie = $1 AND comment <> ''", [idMovie])
}


const starsAverage = async(idMovie) => {
    return await pool.query('select ROUND(AVG(stars), 2) from reviews where id_movie=$1', [idMovie])
}



export {userEmail, reviewExists, insertReview, deleteReview, updateReview, showAllReviews, starsAverage}