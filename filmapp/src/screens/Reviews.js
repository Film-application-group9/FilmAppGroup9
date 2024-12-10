import React, { useState, useEffect } from "react";
import axios from "axios";
import {axiosEmail, axiosUserReview, axiosPostReview ,axiosDeleteReview, axiosPatchReview, axiosGetReviews, axiosGetStars, axiosNewReview} from "../components/reviewFunctions.js"
import { useUser } from "../context/useUser.js";
import '../styles/Review.css'
import {RevStars, Stars} from "../components/reviewStars.js"
import { getMovieDetails, getCredits } from "../components/reviewMovieDetails.js";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { axiosUserGroups, axiosMovieToGroup } from "../components/groupFunctions.js";
import { Helmet } from 'react-helmet' 
import {DurationFormat} from "../components/reviewDuration.js"

const Reviews = () => {
    const {token} =useUser()
    const {username} = useUser()
    const {userId} = useUser()
    
    

    const location = useLocation()
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    //console.log("Reviews-id(movie): ", id)

    
    const [user, setUser] = useState(username)
    
    /*
    const {token, username} =location.state
    console.log("Reviews-token: ",token)
    console.log("Reviews-username: ", username)
    const [idMovie, setIdMovie] = useState(id)*/
    

    /*const [reviewToken, setReviewToken] = useState(token)
    const [email, setEmail] = useState(null)
    
    const [idUser, setIdUser] = useState(userID)
    
    const [stars, setStars] = useState(null)
    const [comment, setComment] = useState(null)*/

    

    const [boolShowAlt, setBoolShowAlt] = useState(false)
    const [boolShowAll, setBoolShowAll] = useState(true)

    //const []
    const [moviename, setMoviename] = useState(null)
    const [idMovie, setIdMovie] = useState(id)
    const [moviename_original, setMoviename_original] = useState(null)

    const [movieArray, setMovieArray] = useState(null)

    const[avgStars, setAvgStars]=useState(null)
    const[reviews, setReviews]=useState(null)

    const[ownReview, setOwnReview]=useState(null)
    const[moDet, setMoDet]=useState(null)
    const [castDet, setCastDet]=useState(null)
    const [director, setDirector]=useState(null)

    let[authState, setAuthState] = useState(false)

    const [groupData, setGroupData] = useState(null)

    const[SeveralGroupsState,setSeveralGroupsState] = useState(false)
    const[groupArray, setGroupArray] = useState()

    const [noImage, setNoImage]=useState(null)
    

    //setIdMovie(req.query.id)

        /*const getMovieSearch = async (moName) => {
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
            
        }*/



        const getDetails =async(idMov) => {
            try{
                let movieByid = await getMovieDetails(token, idMov)
                console.log("movieById: ", movieByid)
                if(movieByid.results.status_code == 34){
                console.log("Bad movie id")
                alert("Bad movie id")
            }else{
                setMoDet(movieByid)
            }
            }catch(error){
                console.error(error)
            }
            try{
                let castById = await getCredits(token, id)
                console.log("castById", castById)
                if(castById.results.status_code == 34){
                console.log("Bad movie id")
                alert("Bad movie id")
            }else{
                setCastDet(castById)
                let crewArray=castById.results.crew
                for(let person of crewArray){
                    if(person.job == "Director"){
                        setDirector(person.name)
                    }
                }

            }
            }catch(error){
                console.error(error)
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
                    const release_date=results.release_date
                    const release_year=release_date.slice(0,4)
                    const duration = results.runtime
                    const duration_formatted = DurationFormat(duration)
                    const countries = results.production_countries
                    const countryArray = countries.map(c => c.name)

                    setMoviename(title)
                    setIdMovie(id)
                    setMoviename_original(origTitle)
                    console.log("ShowMovieDetails-title: ",title)
                    console.log("ShowMovieDetails-id: ", id)
                    //console.log("ShowMovieDetails-genres:type: ", typeof genres)
                    let countryText=""
                    for(let country of countryArray){
                        countryText += country+", "
                    }
                    countryText=countryText.substring(0, countryText.length-2)
                    
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

                    return(<div class="ShowMovieDetails">
                            <Helmet><meta name="viewport" content="width=device-width, initial-scale=1.0" /></Helmet>

                            
                            <div id="Poster"><img id="Poster"
                                src={`https://image.tmdb.org/t/p/w200${posterPath}`}
                                alt={"No poster"}
                                    />
                                    { username =="" || username == null ? "":<AddButtons/>}</div>

                            <div id = "Title_and_rating_and_description">
                            <label className= "Title">{title}</label><label className="Title">{"("}{release_year}{")"}</label><br></br><br/>
                            {avgStars ? <Stars rating={avgStars}/> : <label>No reviews</label>}<br></br>
                            <label>{duration_formatted}</label><br/>
                            <label>{countryText}</label><br/>
                            <label><span className="span_director">Director: </span>{director}</label><br/><br/>
                            <label id="DescriptionHeader" >Description: </label>
                            <p id="Description">{description}</p></div>
                            
                            
                            
                            <div id="details">
                            <div id = "Genres"><h3>Genres</h3>
                            <p>{genreText}</p></div>
                            <div id="spoken_languages"><h3>Spoken languages</h3>
                            <p>{langText}</p></div>
                            <div id="RelDate"><h3>Released</h3>
                            <p>{release_date}</p></div>
                            </div></div>
                            )

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
                    const strs = await axiosGetStars(id)
                    const det = await getDetails(id)
                    setReviews(revs)
                    console.log("Reviews: ", revs)
                    if(strs != null){
                        setAvgStars(strs[0].round)
                        console.log("Stars: ", avgStars)
                    }else{
                        console.log("No stars")
                    }
                    if(username != "" &&  username!=null){
                        const ownRev = await axiosUserReview(token, id)
                        setOwnReview(ownRev)
                    }
                    

                }

            }catch(error){
                console.error(error)
            }
            
        }
    

    

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
    
    


    const AllReviews = () => {
        if(avgStars == null || reviews == null || Object.keys(reviews).length == 0){
            return(<div id ="EmptyAllReviews"><h3>{"All reviews (with comments): "}</h3><p>No reviews with comments</p></div>)
        }else{
            return(<div><div id="AllReviewHeader"><h3>All reviews (with comments): </h3></div>
            <div className="ReviewBox">
                {reviews.map(rw => (
                <div className="review">
                <div className="div_user"><span className = "UserSpan">{"User: "}</span>{rw.username}<br></br><div className="div_rate"><Stars rating={rw.stars}/></div></div>
                <div className="div_date"><span className="DateSpan">Date: </span>{rw.to_char}</div><br></br><br></br>
                <p>{rw.comment}</p>
            </div>
             ))}
            </div></div>)
        }
    }
    const UserReview = () => {
        if(username == null || username == ""){
            return (<div></div>)
        }else{
            if(ownReview == null || Object.keys(ownReview).length == 0){
                return(<div id="EmptyOwnReview"><h3>Own review: </h3><p>No own review yet</p></div>)
            }else{
                return(<div><div id="UserReview"><div className="urOwnReview"><h3>Own review: </h3></div>
                                <div id="UserReviewBox">
                    {ownReview.map(rw => (
                    <div className="review">
                    <div className="div_user"><span className = "UserSpan">{"User: "}</span>{rw.username}{" (User logged in)"}<br></br><div className="div_rate"><Stars rating={rw.stars}/></div></div>
                    <div className="div_date"><span className="DateSpan">Date: </span>{rw.to_char}</div><br></br><br></br>
                    <p>{rw.comment}</p>
                </div>
                 ))}
          </div><div id="delReview"><button  onClick={delReview}>Delete review</button></div>
          </div></div>)
            }
        
    }}


    const showMovieByID = async(input) => {
        //const a = await getMovieSearch()
        //let idMovie = document.getElementById("Movie_id").value
        const b = await getDetails(input)
        setBoolShowAlt(false)
        //const b = await getDetails(token, idMovie)
    }

    /*const showMovieByName = async(input) => {
        //let search = document.getElementById("moviename").value
        const array = await getMovieSearch(input)
        setBoolShowAlt(true)
        

    }*/

    /*const showMovie = async(e) => {
        const input = document.getElementById("Movie_input").value
        console.log(input)
        if(parseInt(input)){
            await showMovieByID(input)
        }else{
            await showMovieByName(input)
        }
        
    }*/
    /*const a_click = async (e) => {
        e.preventDefault()
        let idChosen = e.target.dataset.id
        console.log(idChosen)
        const a = await getDetails(idChosen)
        
    }*/

    /*const MoviesWithSameID = () => {
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
        
    }*/

    /*const SearchInput = () => {
        return(<div><input id="Movie_input" type="text" placeholder="Movie id or title"></input>
                <button id="btn_show_movie" onClick={showMovie}>Show movie</button></div>)
    }*/

    const delReview = async() => {
        const del = await axiosDeleteReview(token, idMovie)
        const a = await showReviews()
    }

    const addToGroup = async () => {
        try{

        
        const groups = await axiosUserGroups(token, userId)
        if (groups.length == 0){
            setGroupData("User has no groups")
            setSeveralGroupsState(false)
        }else if(groups.length == 1){
            const groupID = groups[0].id_group
            const movieToGroup = await axiosMovieToGroup(token, groupID, idMovie, userId, moviename, moviename_original )
            setGroupData("Movie added to your group")
            setSeveralGroupsState(false)
        }else{
            const grArr = groups.map(g => ({
                id: g.id_group,
                name: g.groupname
            }))
            setGroupArray(grArr)
            setGroupData("Several groups found")
            setSeveralGroupsState(true)
            
        }
    }catch(error){
        console.error(error)
    }
        }

    const postToGroupFromMany =async (groupID) => {
        try{
            const movieToGroup = await axiosMovieToGroup(token, groupID, idMovie, userId, moviename, moviename_original )
            setGroupData("Movie added to your group")
            setSeveralGroupsState(false)
        }catch(error){
            setGroupData("Error with group")
            console.error(error)
            setSeveralGroupsState(false)

        }
        
    }
    

    const GroupInformation = () => {
        console.log("groupInformation-groupdata: ", groupData)
        const [selectedValue, setSelectedValue] = useState(null)

        if(SeveralGroupsState == false){
            if(groupData == null){
                return(<div></div>)
            }else{
                return(<div id="groupData"><p>{groupData}</p></div>)
            }
        }else{
            return(<div id="GroupInfo">
                <h3>Choose group: </h3>
                <select id="select_group"value={selectedValue}>
                {groupArray.map(ga => (
                 <option className="groups" value={ga.id}>{ga.name}</option>
                 ))}
                </select><br></br>
                <button onClick={(e) => {postToGroupFromMany(selectedValue);}}>Select group</button><br></br>
                <button onClick={() => cancelChoose()}>Cancel add</button>
            </div>)
            /*return(<div><ul>{groupArray.map((item, index) => {
                <li><a href="" onClick={() =>postToGroupFromMany(item.id_group)}>{item.groupname}</a></li>
            })}
            </ul>

                </div>)*/
        }
        
    }

    const cancelChoose = () => {
        setSeveralGroupsState(false)
        setGroupArray(false)
        setGroupData("The add was canceled")
    }

    const addToFavorites = async () => {
        const response = await axios.post('http://localhost:3001/favorites', { 
            idUser: userId, 
            idMovie: idMovie, 
            title: moviename });
        
        if (response.status === 201) {
            setGroupData('Favorite movie added');
        } else {
            setGroupData('Failed to add favorite movie');
        }
    };

    const AddButtons = () => {
        return(<div id="AddButtons"><button className="review_buttons" onClick={addToGroup}>Add to group</button><br></br>
            <button className="review_buttons" onClick={addToFavorites}>Add to favorites</button></div>)
    }

    const ReviewFields = () => {
        console.log("ReviewFields-username: ", username)
        if(username == null || username == ""){
            return (<div id="RevFieldsNoReg">Only registered users can review the movie</div>)
        }else{
        return(<div><div id="div_review_field">
            <h3>Review movie: </h3>
            <div id="div_review">
           <label>Give stars: </label>
           <select id="setStars">
            {star_grades.map((option, index) => (
            <option key={index} value={option}>
            {option}
          </option>
        ))}
            </select>
            
            <div id="reviewArea">
            <textarea id="comment" placeholder="Comment" rows="5" cols="100"></textarea>
            </div>
            
            </div>
            <div className="review_buttons_div">
            <button className="review_buttons" onClick={postReview}>Post review</button>
            
            </div>
            </div></div>)}
    }

    /*const Footer = () => {
        return(<div className="footer"><p>{groupData}</p></div>)
    }*/

    const ShowCast = () => {
        try{
            if (castDet == null) {
                return(<div id="NoMovie"><p>No movie chosen</p></div>)
            }else {
                /*const castArray=castDet.cast
                let cast
                for(let actor of castArray){
                let arr = {
                name: actor.name,
                original_name: actor.original_name,
                character: actor.character,
                profile: actor.profile_path

                }
                cast.push(arr)
                }*/
                let castArray=castDet.results.cast
                console.log("ShowCast: ", castArray)

                /*let castSize
                if(castArray.length > 17){
                    castSize = 17
                }else{
                    castSize = castArray.length
                }

                const noimg = Array.from({ castSize }, () => null);
                setNoImage(noimg)*/

                

                

                return(<div id="CastParent"><h3>Cast: </h3><div id="CastBox">
                    {castArray.map((actor, index) => (
                      <div className="ActorBox" key={actor.id}>
                        
                        <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={"No picture"}/>
                        <label className="ActorName">{actor.name}</label>
                        <label className="ActorOrigName">{actor.name === actor.original_name ? "" : "(" + actor.original_name + ")"}</label>
                        <label className="ActorCharacter">{actor.character}</label><br></br>
                        
                      </div>
                    ))}
                  </div></div>)
            }
            
        }catch(error){
            console.error(error)
        }
        

        

    }

   /*const ActorImage = ({src, alt}) => {

    const [imgExists, setImgExists] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {


        let img = new Image()
        img.onload = () => {setImgExists(true); setLoading(false);}
        img.onerror = () => {setImgExists(false); setLoading(false);}
        img.src={src}

    }, [src]);


    if(loading){return(<div><label>Loading...</label></div>)}

    return( imgExists ? (<div><img className="profileImg" src={src} alt={alt}/></div>):
     (<div><label>No Image</label></div>))

   }*/

   const Footer = () => {
    const navigate = useNavigate()

        return(<div id="Footer"><a href="" onClick={(event) => { event.preventDefault(); navigate(-1)}}>Back to homepage</a></div>)
   }

   /*const GoBack = () => {
        
        if (window.history.length > 1) {
        console.log("Historiaa: ", window.history.length)
        
        } else {
        console.log("Ei historiaa")
         // Määritä oletussivusi, jos ei ole edellistä sivua.
        }

   }*/


    const star_grades = [0,1,2,3,4,5]
    return (
        <div id="div_main">
            
            <ShowMovieDetails/>
            <GroupInformation/>
            <ShowCast/>
            
            <UserReview/>
            <AllReviews/>
            <ReviewFields/>
            <Footer/>
            
            
            
        </div>
    )


    }

    export default Reviews
