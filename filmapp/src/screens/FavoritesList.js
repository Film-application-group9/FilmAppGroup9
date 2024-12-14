import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/useUser.js';

const FavoritesList = ({ idUser, username, isOwnProfile }) => {
    const [favorites, setFavorites] = useState([]);
    const [userId, setUserId] = useState(idUser);
    const params = useParams();
    const user = username || params.username;
    const { userId: loggedInUserId, username: loggedInUsername } = useUser();
    const navigate = useNavigate();

    const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

    useEffect(() => {
        const fetchUserId = async () => {
            if (user && user !== loggedInUsername) {
                try {
                    console.log(`Fetching profile for username: ${user}`);
                    const response = await axios.get(`http://localhost:3001/profiles/${user}`);
                    if (response.status === 200) {
                        setUserId(response.data.id);
                    } else {
                        alert('Failed to fetch user ID');
                    }
                } catch (error) {
                    console.error('Error fetching user ID:', error);
                    alert('Failed to fetch user ID');
                }
            } else {
                setUserId(loggedInUserId);
            }
        };

        fetchUserId();
    }, [user, loggedInUsername, loggedInUserId]);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (userId) {
                try {
                    console.log(`Fetching favorites for user ID: ${userId}`);
                    const response = await axios.get(`http://localhost:3001/favorites/${userId}`);
                    if (response.status === 200) {
                        console.log('Favorites fetched:', response.data.favorites);
                        setFavorites(response.data.favorites || []); 
                    } else {
                        alert('Failed to fetch favorites');
                    }
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                    alert('Failed to fetch favorites');
                }
            }
        };

        fetchFavorites();
    }, [userId]);

    const deleteFavorite = async (idMovie) => {
        if (!isOwnProfile) {
            alert('You can only remove your own favorites');
            return;
        }

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

    const copyToClipboard = () => {
        const url = `http://localhost:3000/favorites/${user}`;
        navigator.clipboard.writeText(url).then(() => {
            alert('Favorites link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleImageClick = (idMovie) => {
        navigate(`/movies?id=${idMovie}`);
    };

    return (
        <div style={{ marginLeft: '20px' }}>
            <h2>{isOwnProfile ? 'Your Favorites' : `${user}'s Favorites`}</h2>
            {isOwnProfile && (
                <button onClick={copyToClipboard} style={{ fontSize: '12px', padding: '5px 10px' }}>Copy link to favorites</button>
            )}
            {favorites.length === 0 ? (
                <p>No favorites found.</p>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {favorites.map((fav, index) => (
                        <li 
                            key={index} 
                            style={{ 
                                margin: '10px 0', 
                                display: 'flex', 
                                alignItems: 'center', 
                                cursor: 'pointer' 
                            }}
                        >
                            {/* Movie Poster */}
                            {fav.img_path && (
                                <img 
                                    src={`${IMAGE_BASE_URL}${fav.img_path}`} 
                                    alt={fav.moviename}
                                    style={{ 
                                        width: '100px', 
                                        height: '150px', 
                                        objectFit: 'cover', 
                                        marginRight: '10px', 
                                        transition: 'transform 0.2s' 
                                    }}
                                    onClick={() => handleImageClick(fav.id_movie)}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            )}
                            {/* Movie Title and Remove Button */}
                            <div>
                                <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: 'normal' }}>{fav.moviename}</h3>
                                {isOwnProfile && (
                                    <button onClick={() => deleteFavorite(fav.id_movie)} style={{ fontSize: '12px', padding: '5px 5px' }}>Remove</button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FavoritesList;