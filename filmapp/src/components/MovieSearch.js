import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useHistory } from 'react-router-dom';
import { Showtimes } from '../showtimes/showtimes.js';
import { useUser } from "../context/useUser.js";
import { RevStars } from './reviewStars.js';
import { axiosGetStars } from './reviewFunctions.js';
import { axiosMovieToGroup, axiosUserGroups } from './groupFunctions.js';

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [genre, setGenre] = useState('');  
    const [language, setLanguage] = useState('');  
    const [releaseYear, setReleaseYear] = useState('');
    const navigate = useNavigate();
    const {token, username, userId} = useUser()
    console.log("MovieSearch-token: ", token)
    console.log("MovieSearch-userID: ", userId)
    console.log("MovieSearch: username: ", username)

    const [groupArray, setGroupArray] = useState(null)

    const [movieIdChosen, setMovieIdChosen] = useState(null)
    const [moviename, setMoviename] = useState(null)
    const [origMoviename, setOrigMoviename] = useState(null)

    const [groupInfo, setGroupInfo] = useState(null)
    const [severalGroupsState, setSeveralGroupsState] = useState(null)
    const [imgPath, setImgPath] = useState(null)

    // placeholder for auth status
    
    //Muokkasin testaamista varten
    let isLoggedIn = true;

    if(username == null || username.trim() == ""){
        isLoggedIn = false
    }
     

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
        years.push(year);
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (query) searchParams.append('query', query);
        if (genre) searchParams.append('genre', genre);
        if (language) searchParams.append('language', language);
        if (releaseYear) searchParams.append('release_year', releaseYear);
        const response = await fetch(`http://localhost:3001/search?${searchParams.toString()}`);
        const data = await response.json();

        if (response.ok) {
            setMovies(data.results);
        } else {
            alert('Search failed');
        }
    };

    const addFavorite = async (idMovie, title) => {
        //const idUser = '1';
        console.log('userid addfavorites: '+userId)
        const response = await axios.post('http://localhost:3001/favorites/', { 
            idUser: userId, 
            idMovie: idMovie, 
            title: title });
        
        if (response.status === 200) {
            alert('Favorite movie added');
        } else {
            alert('Failed to add favorite movie');
        }
    };

    const getFavorites = async (userId) => {
        const response = await axios.get('http://localhost:3001/favorites/' + userId);
        if (response.status === 200) {
            navigate('/favorites', { state: { favorites: response.data } });
        } else {
            alert('Failed to get favorites');
        }
    };

    const ToReviewsButton = ({id}) => {
        const navigate = useNavigate();
      
        const handleClick = () => {

            navigate(`/movies?id=${id}`, {
                state: { token: token,
                            username: username
                  },
              });
        }
        
        handleClick()
      
        return(<button onClick={handleClick}>See reviews</button>)
    }
    const GroupButton = ({idMovie, moviename, origMoviename, imgPath}) => {
        return(<button onClick={() => AddToGroupButton(idMovie, moviename, origMoviename, imgPath)}>Add to Group</button>)
    }

    const AddToGroupButton = async (idMovie, moviename, origMoviename, imgPath) => {
        //token ok
        //idGroup lisävalinta
        if(moviename != null){

        
        setMovieIdChosen(idMovie)
        //userId ok
        setMoviename(moviename)
        setOrigMoviename(origMoviename)
        setImgPath(imgPath)
        try{
        const groups = await axiosUserGroups(token, userId)
        if(groups.length == 0){
            setGroupInfo("User has no groups")
            setGroupArray([])
        }else if(groups.length == 1){
            const idGroup = groups[0].id_group
            const add = await axiosMovieToGroup(token, idGroup, idMovie, userId, moviename, origMoviename, imgPath)
            setGroupInfo("Movie has been added to user's group")
            setGroupArray([])
        }else{
            setGroupInfo("User has many groups, select one: ")
            console.log("GroupArray: ", groups)
            setGroupArray(groups)

        }
        }catch(error){
            console.error(error)
        }
    }
    }

    const cancelChoose = () => {
        setGroupArray(null)
        setGroupInfo("The add was canceled")
    }
    const ChooseFromManyGroups = ({id}) => {
        const [groupChosen, setGroupChosen] = useState("No group selected")

        useEffect(() => {
            if(groupArray != null){
              if(groupArray.length > 0){
                setGroupChosen(groupArray[0].id_group)
              }
            }
              
          }, [groupArray])

        
        //console.log("ChooseFromManyGroups-id's", id," ",movieIdChosen)
        if(movieIdChosen == id ){
            console.log("Osuma")
        if(groupArray == null ||groupArray.length == 0){
            return(<div>{groupInfo}</div>)
        }else{
            return(<div><h3>Choose group: </h3><select value={groupChosen} onChange={(e) => setGroupChosen(e.target.value)}>
                {groupArray.map(ga => (
                    <option value={ga.id_group}>{ga.groupname}</option>
                ))}
                </select><br></br>
                <button onClick={(e) => {postToGroupFromMany(groupChosen)}}>Select group</button><br></br>
                <button onClick={(e) => {cancelChoose()}}>Cancel add</button>
                </div>)
        }
    }else{
        return(<div></div>)
    }
    }

    const postToGroupFromMany = async(groupID) => {
        try{
            console.log("postToGroupFromMany-token", token)
            console.log("postToGroupFromMany-groupID", groupID)
            console.log("postToGroupFromMany-movieIdChosen", movieIdChosen)
            console.log("postToGroupFromMany-moviename", moviename)
            console.log("postToGroupFromMany-origMoviename", origMoviename)
            console.log("postToGroupFromMany-imgpath", imgPath)
            const movieToGroup = await axiosMovieToGroup(token, groupID, movieIdChosen,userId, moviename, origMoviename, imgPath )
            setGroupInfo("Movie added to your group")
            setGroupArray([])
        }catch(error){
            alert(error)
            console.error(error)
        }
    }

    const ToReviewsImg = ({id, poster_path, title}) => {
        const navigate = useNavigate();
      
        const handleClick = () => {

            navigate(`/movies?id=${id}`, {
                state: { token: token,
                            username: username
                  },
              });
        }
        
        handleClick()
      
        return(<div>{poster_path && (
            <img
                src={`https://image.tmdb.org/t/p/w200${poster_path}`}
                alt={title}
                onClick={handleClick}
            />
            
        )}
        </div>)
    }

    return (
        <div>
          {isLoggedIn && 
  <button 
    onClick={getFavorites} 
    style={{ 
      float: 'right', 
      height: '50px', 
      width: '200px', 
      margin: '20px', 
      fontSize: '16px'  
    }}
  > View your favorites
          </button>
            }
            <form onSubmit={handleSearch}>
                <h1>Search movies</h1>
                <input required
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter the title..."
                />
                <select value={genre} onChange={(e) => setGenre(e.target.value)}>
                    <option value="">Select Genre</option>
                    <option value="Action">Action</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Science Fiction">Science Fiction</option>
                </select>

                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Finnish">Finnish</option>
                    <option value="German">German</option>
                </select>

                <select value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)}>
                    <option value="">Select Release Year</option>
                    {years.map((year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <button type="submit">Search</button>
                <div className="movie-results">
                    <ul>
                        {movies.map((movie) => (
                            <li key={movie.id}>
                                <h3>{movie.title}</h3>
                                <p>{"Released: "}{movie.release_date}</p>

                                <ToReviewsImg id={movie.id} poster_path={movie.poster_path} title={movie.title}/>
                                 {isLoggedIn && <div><button onClick={() => addFavorite(movie.id, movie.title)}>Add to favorites</button>
                                 </div>} 
                                 <ToReviewsButton id={movie.id}/>
                                 {isLoggedIn  && <div><GroupButton idMovie={movie.id} moviename={movie.title} origMoviename={movie.original_title}
                                 imgPath={movie.poster_path}/>
                                <ChooseFromManyGroups id={movie.id}/></div>}
                                
                            </li>
                           
                        ))}
                         
                    </ul>
                </div>
            </form>
        
            
            <Showtimes loggedIn={username == "" || username == null? false:true} token={token} userId={userId}  />
        </div>
    );
};

export default MovieSearch;