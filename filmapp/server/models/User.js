import { pool } from "../helpers/db.js";

const insertUser = async (username,hashedPassword) => {
    return await pool.query('insert into accounts (username,password) values ($1,$2) returning *',[username,hashedPassword])
}

const selectUserByUsername = async (username) => {
    return await pool.query('select * from accounts where username=$1',[username])
}

const removeUser = async (id) => {
    return await pool.query('delete from accounts where id = $1 returning id',[id])
}

const getUser = async() => {
    return await pool.query('select id,username from accounts')
}
export { insertUser, selectUserByUsername, removeUser, getUser }