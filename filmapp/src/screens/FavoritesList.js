import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/useUser.js";

const FavoritesList = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const { userId } = useUser()

    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

    useEffect(() => {
        
        axios.get(`http://localhost:3001/favorites/${userId}`)
     
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data)
                    setFavorites(response.data);
                } else {
                    alert('Failed to fetch favorites');
                }
            })
            .catch(error => {
                console.error('Error fetching favorites:', error);
                alert('Failed to fetch favorites');
            });
    }, []);

    const deleteFavorite = async (idMovie) => {
        try {
            const response = await axios.delete(`http://localhost:3001/favorites/delete/${userId}/${idMovie}`);
            if (response.status === 200) {
                alert('Favorite movie removed');
                setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id_movie !== idMovie));
            } else {
                alert('Failed to remove favorite movie');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            alert('Failed to remove favorite movie');
        }
    };

    return (
        <div>
            <h1>Favorites List</h1>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {favorites.map((fav, index) => (
                    <li key={index} style={{ margin: '10px 0', display: 'flex', alignItems: 'center' }}>
                        {/* Movie Poster */}
                        <img 
                            src={fav.img_path ? `${IMAGE_BASE_URL}${fav.img_path}` : '/placeholder-image.jpg'} 
                            alt={fav.moviename}
                            style={{ width: '100px', height: '150px', objectFit: 'cover', marginRight: '10px' }}
                        />
                        {/* Movie Title and Remove Button */}
                        <div>
                            <h3 style={{ margin: '0 0 10px' }}>{fav.moviename}</h3>
                            <button onClick={() => deleteFavorite(fav.id_movie)}>Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate(-1)}>Return</button>
        </div>
    );
}

export default FavoritesList;