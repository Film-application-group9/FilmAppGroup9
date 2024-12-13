import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/useUser.js";

const FavoritesList = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);
    const { userId } = useUser()

    useEffect(() => {
        //const idUser = '2';
        axios.get(`http://localhost:3001/favorites/${userId}`)
        /*axios.get('http://localhost:3001/favorites/' +userId, {
            idUser: userId
        })*/
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
        //const idUser = '1'; 
        try {
            const response = await axios.delete(`http://localhost:3001/favorites/delete/${userId}/${idMovie}`);
            if (response.status === 200) {  
                alert('Favorite movie removed');
                
                setFavorites(prevFavorites => prevFavorites.filter(fav => fav.idMovie !== idMovie));
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
            <ul>
                {favorites.map((fav, index) => (
                    <li key={index}>
                        {fav.title}
                        <button onClick={() => deleteFavorite(fav.idMovie)}>Remove</button>            
                    </li>
                ))}
            </ul>
            <button onClick={() => navigate(-1)}>Return</button>
        </div>
    );
}

export default FavoritesList;