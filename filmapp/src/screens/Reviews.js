import React, { useState, useEffect } from "react";
import axios from "axios";
import {axiosEmail, axiosUserReview, axiosPostReview ,axiosDeleteReview, axiosPatchReview, axiosGetReviews, axiosGetStars, axiosNewReview} from "../components/reviewFunctions.js"
import { useUser } from "../context/useUser.js";
import '../styles/Review.css'
import {RevStars} from "../components/reviewStars.js"
import { getMovieByName, getMovieDetails } from "../components/reviewMovieDetails.js";
import { useLocation } from "react-router-dom";

const Reviews = () => {
    //const {token, username, userID} =useUser()
    const location = useLocation()
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    console.log("Reviews-id: ", id)

    const {token} =location.state
    console.log("Reviews-token: ",token)

    const paivitys = () => {

    }

    /*const [reviewToken, setReviewToken] = useState(token)
    const [email, setEmail] = useState(null)
    
    const [idUser, setIdUser] = useState(userID)
    
    const [stars, setStars] = useState(null)
    const [comment, setComment] = useState(null)*/

    const [idMovie, setIdMovie] = useState(id)

    const [boolShowAlt, setBoolShowAlt] = useState(false)
    const [boolShowAll, setBoolShowAll] = useState(true)

    const [moviename, setMoviename] = useState(null)

    const [movieArray, setMovieArray] = useState(null)

    const[avgStars, setAvgStars]=useState(null)
    const[reviews, setReviews]=useState(null)

    const[ownReview, setOwnReview]=useState(null)
    const[moDet, setMoDet]=useState(null)

    console.log("Reviews-token: ", token)
    //setIdMovie(req.query.id)

        const getMovieSearch = async (moName) => {
            //let moName = document.getElementById("moviename").value
            let movArr = []
            let moviebyname = await getMovieByName(token, moName)
            const foundSize = moviebyname.results.results.length
            console.log("Löydetty: ",foundSize)
            if (foundSize == 0){
                console.log("No movies found")
            }else{
                const movieFound = moviebyname
                console.log("Found:", movieFound)
                console.log("moviefound-type: ", typeof movieFound)
                console.log("moviefound-genres: ", movieFound.results.results.genres)
                const movieArray2 = movieFound.results.results.map(movie => ({
                    title: movie.title,
                    original_title: movie.original_title,
                    id: movie.id,
                    release_date: movie.release_date,
                    orig_lang: movie.original_language
                }))
                
                for(let mov of movieArray2){
                    console.log("Mov: ", movieArray)
                    let moNameSmallCase = moName.toLowerCase()
                    let resTitleSmallCase = mov.title.toLowerCase()
                    if(moNameSmallCase == resTitleSmallCase){
                        console.log("Movie found by title: ", mov.title)
                        console.log("ID: ", mov.id)
                        movArr.push({id: mov.id, release_date: mov.release_date, original_lang:mov.orig_lang})
                    }

                    let resOrigTitleSmallCase = mov.original_title.toLowerCase()

                    if(moNameSmallCase == resOrigTitleSmallCase){
                        console.log("Movie found by original title: ", mov.original_title)
                        console.log("ID: ", mov.id)
                        let boolHelp = false
                        for(let mov2 of movArr){
                            if(mov2.id == mov.id){
                                boolHelp = true
                                break
                            }
                        }
                        if(boolHelp == false){
                            movArr.push({id: mov.id, release_date: mov.release_date, original_lang:mov.orig_lang})
                        }
                        
                    }

                    



                }

                

                setMovieArray(movArr)
                
            }
            
        }



        const getDetails =async(idMov) => {
            //let idMovie = document.getElementById("Movie_id").value
            let movieByid = await getMovieDetails(token, idMov)
            console.log("movieById: ", movieByid)
            if(movieByid.results.status_code == 34){
                console.log("Bad movie id")
                alert("Bad movie id")
            }else{
                setMoDet(movieByid)
            }
            

        }

        useEffect(() => {
            const a = async() => {
                const b = await showReviews()
            } 
            a()
        }, [idMovie])


        const ShowMovieDetails = () => {
            try{
                if(moDet != null){
                    const results = moDet.results
                    const title = results.title
                    const origTitle = results.original_title
                    const description = results.overview
                    const genres = results.genres.map(g => g.name)
                    const posterPath= results.poster_path
                    const spokenLang = results.spoken_languages.map(spLang => spLang.english_name)
                    const id = results.id
                    setMoviename(title)
                    setIdMovie(id)
                    console.log("ShowMovieDetails-title: ",title)
                    console.log("ShowMovieDetails-id: ", id)
                    //console.log("ShowMovieDetails-genres:type: ", typeof genres)
                    let genreText=""

                    for(let genre of genres){
                        genreText+=genre +", "
                    }
                    genreText = genreText.substring(0, genreText.length-2)
                    
                    let langText=""
                    for(let lang of spokenLang){
                        langText+=lang+", "
                    }
                    langText = langText.substring(0, langText.length-2)

                    return(<div className="ShowMovieDetails"><h1>{title}</h1>
                            <h2>{origTitle == title ? "": "Original title: " + origTitle}</h2>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${posterPath}`}
                                alt={"No poster"}
                                    />
                            <br></br>
                            <Stars rating={avgStars}/>
                            <h3>Description</h3>
                            <p>{description}</p>
                            <h3>Genres</h3>
                            <p>{genreText}</p>
                            <h3>Spoken languages</h3>
                            <p>{langText}</p></div>)

                }
                
            }catch(error){
                console.error(error);
                return(<div>{"Error: "}{error}</div>)
            }
            
            
        }

        const showReviews = async() =>{
            try{
                let id = idMovie
                if(parseInt(id)){
                    const revs = await axiosGetReviews(token, id)
                    const strs = await axiosGetStars(token, id)
                    const det = await getDetails(id)
                    setReviews(revs)
                    console.log("Reviews: ", revs)
                    if(strs != null){
                        setAvgStars(strs[0].round)
                        console.log("Stars: ", avgStars)
                    }else{
                        console.log("No stars")
                    }
                    const ownRev = await axiosUserReview(token, id)
                    setOwnReview(ownRev)

                }

            }catch(error){
                console.error(error)
            }
            
        }
    

    /*
    const showReviews = () =>{
        let id = document.getElementById("Movie_id").value
        console.log("showReviews: ",id)
        let revs = axiosGetReviews(reviewToken, id)
        setReviews(revs)
        let strs = axiosGetStars(reviewToken, id)
        setAvgStars(strs)
        console.log("reviews", revs)
        console.log("avgStars: ",strs)

    }*/

    const postReview = async () => {
        //let idMovie = document.getElementById("Movie_id").value
        //let moviename = document.getElementById("moviename").value

        let stars = document.getElementById("setStars").value
        let comment = document.getElementById("comment").value
        
        console.log("postReview-token: ", token)
        console.log("postReview-idMovie: ", idMovie)
        console.log("postReview-moviename: ", moviename)
        const a = await axiosNewReview(token, idMovie, moviename, stars, comment)
        console.log("postReview: ", "newReview done")
        const b = await showReviews()
        console.log("postReview: ", "showReviews done")


    }
    
    const Stars = ({rating}) =>{
        if(avgStars != null){
            let ratingFloat = parseFloat(rating)
            console.log("ratingFloat type: ", typeof ratingFloat)
            let starArray = RevStars(ratingFloat)
            return(<div>
                {"Rating: "}{rating}{" "}{starArray.map(item => item)}
            </div>)
        }
        
    }


    const AllReviews = () => {
        if(avgStars == null || reviews == null || Object.keys(reviews).length == 0){
            return(<div><h3>{"All reviews (with comments): "}</h3><p>No reviews with comments</p></div>)
        }else{
            return(
            <div>
                <h3>{"All reviews (with comments): "}</h3>
                {reviews.map(rw => (
                <div className="container">
                <div className="div_user">{"User: "}{rw.username}<br></br><div className="div_rate"><Stars rating={rw.stars}/></div></div>
                <div className="div_date">{"Date: "}{rw.to_char}</div><br></br><br></br>
                <p className="p_comment">{rw.comment}</p>
            </div>
             ))}
            </div>)
        }
    }
    const UserReview = () => {
            if(ownReview == null || Object.keys(ownReview).length == 0){
                return(<div><h3>{"Own review: "}</h3><p>No own review yet</p></div>)
            }else{
                return(<div><h3>{"Own review: "}</h3>
                    {ownReview.map(rw => (
                    <div className="container">
                    <div className="div_user">{"User: "}{rw.username}{" (User logged in)"}<br></br><div className="div_rate"><Stars rating={rw.stars}/></div></div>
                    <div className="div_date">{"Date: "}{rw.to_char}</div><br></br><br></br>
                    <p className="p_comment">{rw.comment}</p>
                </div>
                 ))}
          </div>)
            }
        
    }


    const showMovieByID = async(input) => {
        //const a = await getMovieSearch()
        //let idMovie = document.getElementById("Movie_id").value
        const b = await getDetails(input)
        setBoolShowAlt(false)
        //const b = await getDetails(token, idMovie)
    }

    const showMovieByName = async(input) => {
        //let search = document.getElementById("moviename").value
        const array = await getMovieSearch(input)
        setBoolShowAlt(true)
        

    }

    const showMovie = async(e) => {
        const input = document.getElementById("Movie_input").value
        console.log(input)
        if(parseInt(input)){
            await showMovieByID(input)
        }else{
            await showMovieByName(input)
        }
        
    }
    const a_click = async (e) => {
        e.preventDefault()
        let idChosen = e.target.dataset.id
        console.log(idChosen)
        const a = await getDetails(idChosen)
        
    }

    const MoviesWithSameID = () => {
        if(boolShowAlt == true){
            if(movieArray.length > 1){
                const movArrLen = movieArray.length
                const text = "Found "+movArrLen+" movies with same title: "
                console.log("MoviesWithSameID-movieArray: ", movieArray)
                return(<div><h3>{text}</h3><table>
                        <thead>
                             <tr>
                            <th>Movie id</th>
                            <th>Release Date</th>
                            <th>Original language</th>
                            </tr>
                            </thead>
                        <tbody>
                    {movieArray.map((movie, index) => (
                        <tr>
                        <td><a href="" onClick={a_click} data-id={movie.id}>{"id: "}{movie.id}</a></td>
                        <td>{movie.release_date}</td>
                        <td>{movie.original_lang}</td>
                        </tr>
                    ))}
                  </tbody></table></div>)
            }
        }else{
            return(<div></div>)
        }
        
    }

    const SearchInput = () => {
        return(<div><input id="Movie_input" type="text" placeholder="Movie id or title"></input>
                <button id="btn_show_movie" onClick={showMovie}>Show movie</button></div>)
    }

    const delReview = async() => {
        const del = await axiosDeleteReview(token, idMovie)
        const a = await showReviews()
    }

    const ReviewFields = () => {
        return(<div id="div_1">
            <div id="div_2">
           <label>Give stars: </label>
           <select id="setStars">
            {star_grades.map((option, index) => (
            <option key={index} value={option}>
            {option}
          </option>
        ))}
            </select>
            </div>
            <div id="div_3">
            <textarea id="comment" className="comment" placeholder="Comment" rows="5" cols="50"></textarea>
            <div className="review_buttons_div">
            <button classname="review_buttons" onClick={postReview}>Post review</button>
            <button className="review_buttons" onClick={showReviews}>Refresh reviews</button>
            <button className="review_buttons" onClick={delReview}>Delete review</button>
            </div>
            </div>
            </div>)
    }

    const Footer = () => {
        return(<div className="footer"></div>)
    }

    const star_grades = [0,1,2,3,4,5]
    return (
        <div id="div_main">
            <ShowMovieDetails/>
            <UserReview/>
            <AllReviews/>
            <ReviewFields/>
            <Footer/>
        </div>
    )


    }

    export default Reviews
