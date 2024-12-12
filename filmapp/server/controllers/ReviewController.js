import {reviewExists, insertReview, deleteReview, updateReview, showAllReviews, starsAverage} from '../models/review.js'
import dotenv from 'dotenv';
import decodeTokenUser from '../helpers/jwt_decode.js';


dotenv.config()

const getAuth = async(req,res,next) => {
    try{
        const authHeader = req.headers.authorization
        const decodedUser = decodeTokenUser(authHeader)
        const decodedUserID = decodedUser.id
        const givenID = req.params.userID
        console.log("getAuth-decodedUserID: ", decodedUserID)
        console.log("getAuth-givenID: ", givenID)
        if(decodedUserID == givenID){
            return res.json({Authentication: "Ok"})
        }else{
            return res.json({Authentication: "Not ok"})
        }
    }catch(error){
        return next(error)
    }
    
}


const getReview = async (req,res,next) => {
    try{
        const authHeader = req.headers.authorization
        const decodedUser = decodeTokenUser(authHeader)
        const result = await reviewExists(req.params.idMovie, decodedUser.id)
        //console.log(result)
        return res.status(200).json(result.rows)
    }catch(error){
        return next(error)
    }
}

const postReview = async (req,res,next) => {
    try{
        const authHeader = req.headers.authorization
        const decodedUser = decodeTokenUser(authHeader)
        const postReview = await insertReview(decodedUser.id, req.body.idMovie, req.body.moviename, req.body.stars, req.body.comment)
        console.log("Review posted")
        return res.status(200).json({user: req.body.idUser, movie: req.body.idMovie})
    }catch(error){
        return next(error)
    }
}

const removeReview = async(req,res, next) => {
    try{
        const authHeader = req.headers.authorization
        const decodedUser = decodeTokenUser(authHeader)
        const del = await deleteReview(req.params.idMovie, decodedUser.id)
        console.log("Review deleted")
        return res.status(200).json({user: req.params.idUser, movie: req.params.idMovie})
    }catch(error){
        return next(error)
    }
}

const replaceReview = async(req,res, next) => {
    try{
        const authHeader = req.headers.authorization
        const decodedUser = decodeTokenUser(authHeader)
        const update = await updateReview(decodedUser.id, req.body.idMovie, req.body.moviename, req.body.stars, req.body.comment)
        console.log(getReview(req.body.idUser, req.body.idUser))
        return res.status(200).json({user: req.body.idUser, movie: req.body.idMovie})
    }catch(error){
        return next(error)
    }
}

const showReviews = async(req,res, next) => {
    try{
        const reviews = await showAllReviews(req.params.idMovie)
        console.log(reviews)
        return res.status(200).json(reviews.rows)
    }catch(error){
        return next(error)
    }
}

const showAvgStars = async(req,res,next) => {
    try{
        const stars = await starsAverage(req.params.idMovie)
        console.log(stars)
        return res.status(200).json(stars.rows)
    }catch(error){
        return next(error)
    }
}

const newReview = async(req,res,next) => {
    try{

        const authHeader = req.headers.authorization
        const decodedUser = decodeTokenUser(authHeader)
        console.log("newReview-decodedUser")
        const oldReview = await reviewExists(req.body.idMovie, decodedUser.id)
        const oldReviewSize = Object.keys(oldReview).length
        if(oldReviewSize > 1){
            const delRev = await deleteReview(req.body.idMovie, decodedUser.id)
            const postRev = await insertReview(decodedUser.id, req.body.idMovie, req.body.moviename, req.body.stars, req.body.comment)
        }else if(oldReviewSize == 1){
            const updateRev = await updateReview(decodedUser.id, req.body.idMovie, req.body.moviename, req.body.stars, req.body.comment)
        }else{
            const postRev = await insertReview(decodedUser.id, req.body.idMovie, req.body.moviename, req.body.stars, req.body.comment)
        }
        return res.status(200).json({user: decodedUser.id, movie: req.body.idMovie})

    }catch(error){
        return next(error)
    }
}

export {getAuth, getReview, postReview, removeReview, replaceReview, showReviews, showAvgStars, newReview}