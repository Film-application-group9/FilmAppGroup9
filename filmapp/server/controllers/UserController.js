import { compare, hash } from "bcrypt";
import { insertUser,selectUserByUsername, removeUser, getUser } from "../models/User.js";
import { ApiError } from "../helpers/ApiError.js";
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config()

const { sign } = jwt

const postRegistration = async(req,res,next) => {
    try {
        if (!req.body.username || req.body.username.length === 0) return next(new ApiError('Invalid username',400))
        if (!req.body.password || req.body.password.length < 8) return next(new ApiError('Invalid password',400))
        const hashedPassword = await hash(req.body.password,10)
        const userFromDb = await insertUser(req.body.username,hashedPassword)
        const user = userFromDb.rows[0]
        return res.status(201).json(createUserObject(user.id,user.username))
    } catch (error) {
        return next(error)
    }
}

const createUserObject = (id,username,token=undefined) => {
    return {
        'id':id,
        'username':username,
        ...(token !== undefined) && {'token':token}
    }
}

const postLogin = async(req,res,next) => {
    console.log('hei  ' +req.body.username)
    const username = req.body.username
    const invalid_credentials_message = 'Invalid credentials.'
    try {
        const userFromDb = await selectUserByUsername(req.body.username)
        if (userFromDb.rowCount === 0) return next(new ApiError(invalid_credentials_message))
        const user = userFromDb.rows[0]
        if (!await compare(req.body.password,user.password)) return next(new ApiError(invalid_credentials_message,401))
        const token = sign({username: username, id: user.id},process.env.JWT_SECRET_KEY,{expiresIn: '1m'})
        console.log("Postlogin-user: ", username)
        console.log("Postlogin-token: ", token)
        return res
            .header('Access-Control-Expose-Headers','Authorization')
            .header('Authorization','Bearer ' + token)
            .status(200).json(createUserObject(user.id,user.username))
            //.status(200).json(createUserObject(user.id,user.username,token))
        //return res.status(200).json(createUserObject(user.id,user.username))
    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req,res,next) => {
    /*const user_not_found_message = 'User not found'
    const userFromDb = await selectUserByUsername(req.body.username)
    if (userFromDb.rowCount === 0) return next(new ApiError(user_not_found_message))
    const user = userFromDb.rows[0]
    const result = await removeUser(user.id)
    console.log(result)
    return res.status(200).json(user.id)*/
    try {
        const id = parseInt(req.params.id)
        if (!id) return next(new ApiError('id not found'))
        const result = await removeUser(id)
        console.log(result)
        return res.status(200).json({id: id})
    } catch (error) {
        next(new ApiError('delete testierror'))
    }
}

/*const authorizationHeader = (username) => {
    const token = sign({username: username},process.env.JWT_SECRET_KEY,{expiresIn: '1m'})
    return res.header('Access-Control-Expose-Headers','Authorization')
        .header('Authorization','Bearer ' + token)
}*/
const getAllUsers = async(req,res,next) => {
    try {
        const result = await getUser()
        return res.status(200).json(result.rows)
    } catch (error) {
        return next(error)
    }
}


export { postRegistration, postLogin, deleteUser, getAllUsers }