import { pool } from "../helpers/db.js";

const insertFavorite = async (idUser, idMovie, title) => {
    return await pool.query(
        'INSERT INTO favorites (id_user, id_movie, moviename) VALUES ($1, $2, $3) ON CONFLICT (id_user, id_movie) DO NOTHING RETURNING *',
        [idUser, idMovie, title]
    );
};

const getFavoriteByUserId = async (idUser) => {
    return await pool.query(
        'SELECT * FROM favorites WHERE id_user = $1',
        [idUser]
    );
};

const removeUserFavorite = async (idUser, idMovie) => {
    return await pool.query(
        'DELETE FROM favorites WHERE id_user = $1 AND id_movie = $2 RETURNING id_movie',
        [idUser, idMovie]
    );
};

export { insertFavorite, getFavoriteByUserId, removeUserFavorite };