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

    
    const [user, setUser] = useState(username)
    

    

    const [boolShowAlt, setBoolShowAlt] = useState(false)
    const [boolShowAll, setBoolShowAll] = useState(true)

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

    const[imgPath, setImgPath]=useState(null)
    

        const getDetails =async(idMov) => {
            try{
                let movieByid = await getMovieDetails(token, idMov)
                if(movieByid.results.status_code == 34){
                alert("Bad movie id")
            }else{
                setMoDet(movieByid)
            }
            }catch(error){
                console.error(error)
            }
            try{
                let castById = await getCredits(token, id)
                if(castById.results.status_code == 34){
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
                    setImgPath(posterPath)
                    setMoviename(title)
                    setIdMovie(id)
                    setMoviename_original(origTitle)
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
                    if(strs != null){
                        setAvgStars(strs[0].round)
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

        let stars = document.getElementById("setStars").value
        let comment = document.getElementById("comment").value
        
        const a = await axiosNewReview(token, idMovie, moviename, stars, comment)
        const b = await showReviews()


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
        const b = await getDetails(input)
        setBoolShowAlt(false)
    }

   

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
            const movieToGroup = await axiosMovieToGroup(token, groupID, idMovie, userId, moviename, moviename_original, imgPath )
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
            const movieToGroup = await axiosMovieToGroup(token, groupID, idMovie, userId, moviename, moviename_original, imgPath )
            setGroupData("Movie added to your group")
            setSeveralGroupsState(false)
        }catch(error){
            setGroupData("Error with group")
            console.error(error)
            setSeveralGroupsState(false)

        }
        
    }
    

    const GroupInformation = () => {
        const [selectedValue, setSelectedValue] = useState("No group selected")

        useEffect(() => {
            if(groupArray != null){
              if(groupArray.length > 0){
                setSelectedValue(groupArray[0].id)
              }
            }
              
          }, [groupArray])

        if(SeveralGroupsState == false){
            if(groupData == null){
                return(<div></div>)
            }else{
                return(<div id="groupData"><p>{groupData}</p></div>)
            }
        }else{
            return(<div id="GroupInfo">
                <h3>Choose group: </h3>
                <select id="select_group"value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                {groupArray.map(ga => (
                 <option className="groups" value={ga.id}>{ga.name}</option>
                 ))}
                </select><br></br>
                <button onClick={(e) => {postToGroupFromMany(selectedValue)}}>Select group</button><br></br>
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
                let castArray=castDet.results.cast
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

  

   const Footer = () => {
    const navigate = useNavigate()

        return(<div id="Footer"><a href="" onClick={(event) => { event.preventDefault(); navigate(-1)}}>Back to homepage</a></div>)
   }



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
