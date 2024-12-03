import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useHistory } from 'react-router-dom';
import { Showtimes } from '../showtimes/showtimes.js';
import { useUser } from "../context/useUser.js";

const MovieSearch = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [genre, setGenre] = useState('');  
    const [language, setLanguage] = useState('');  
    const [releaseYear, setReleaseYear] = useState('');
    const navigate = useNavigate();
    const {token} = useUser()
    console.log("MovieSearch-token: ", token)
    

    // placeholder for auth status
     const isLoggedIn = true;

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
        const idUser = '1';
        const response = await axios.post('http://localhost:3001/favorites', { idUser, idMovie, title });
        
        if (response.status === 201) {
            alert('Favorite movie added');
        } else {
            alert('Failed to add favorite movie');
        }
    };

    const getFavorites = async () => {
        const response = await axios.get('http://localhost:3001/favorites/1');
        if (response.status === 200) {
            navigate('/favorites', { state: { favorites: response.data } });
        } else {
            alert('Failed to get favorites');
        }
    };

    const ToReviews = ({id}) => {
        const navigate = useNavigate();
      
        const handleClick = () => {

            navigate(`/movies?id=${id}`, {
                state: { token: token },
              });
        }
        
      
        return (<button onClick={handleClick}>See reviews</button>)
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
                                {movie.poster_path && (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                )}
                                 {isLoggedIn && <div><button onClick={() => addFavorite(movie.id, movie.title)}>Add to favorites</button>
                                 <ToReviews id={movie.id}/></div>} 
                                
                            </li>
                           
                        ))}
                         
                    </ul>
                </div>
            </form>
        
            
            <Showtimes/>
        </div>
    );
};

export default MovieSearch;