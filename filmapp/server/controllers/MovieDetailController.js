import fetch from "node-fetch";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config()


const movieByName = async(req,res,next) => {

    try{
        let {query, moviename} = req.query
        let apiKey = process.env.TMDB_API_KEY
        let searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(moviename)}`;
        let result = await fetch(searchUrl)
        let data = await result.json();
        res.json({ results: data });
        
        
    }catch(error){
        return next(error)
    }
    

}

const movieDescription = async(req,res,next) => {
    try{
        let id = req.query.id
    const apiKey = process.env.TMDB_API_KEY
    const url = `https://api.themoviedb.org/3/movie/` + id+`?api_key=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()
    res.json({ results: data });
    }catch(error){
        return next(error)
    }
    
}

const movieCredits = async(req,res,next) => {
    try{
        const id = req.query.id
    const apiKey = process.env.TMDB_API_KEY
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()
    res.json({results: data})
    }catch(error){
        return next(error)
    }
    
}

export {movieByName, movieDescription, movieCredits}