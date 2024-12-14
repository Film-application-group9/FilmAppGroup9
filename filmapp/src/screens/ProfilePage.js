import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';
import FavoritesList from './FavoritesList.js';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { token, userId: loggedInUserId, username: loggedInUsername } = useUser() || {};
    const { username } = useParams();
    const [user, setUser] = useState({ username: '', id: null });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const url = username ? `http://localhost:3001/profiles/${username}` : 'http://localhost:3001/profiles/me';
                const headers = username ? {} : { 'Authorization': token };
                const response = await axios.get(url, { headers });
                if (response.status === 200) {
                    setUser(response.data);
                } else {
                    alert('Profile not found');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                alert('Profile not found');
            }
        };

        fetchProfile();
    }, [token, username]);

    const handleSearch = (event) => {
        event.preventDefault();
        const searchUsername = event.target.elements.username.value; 
        navigate(`/profiles/${searchUsername}`);
        
    };

    const profileUrl = username ? `http://localhost:3000/profiles/${username}` : `http://localhost:3000/profiles/${user.username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl).then(() => {
            alert('Profile link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const isOwnProfile = username === loggedInUsername || user.id === loggedInUserId;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                    <h1>{isOwnProfile ? 'My Profile' : `${user.username}'s Profile`}</h1>
                    {user.username && (
                        <div>
                            <label>
                                Username:
                                <br />
                                <div
                                    style={{
                                        marginLeft: '10px',
                                        fontWeight: 'bold',
                                        border: '1px solid #ccc',
                                        padding: '5px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        backgroundColor: '#f9f9f9'
                                    }}
                                >
                                    {user.username}
                                </div>
                            </label>
                        </div>
                    )}
                    <button onClick={() => navigate(-1)}>Return</button>
                    {user.username && (
                        <div>
                            <button onClick={copyToClipboard}>Copy link to profile</button>
                        </div>
                    )}
                    <div>
                        <h2>Search profiles</h2>
                        <form onSubmit={handleSearch}>
                            <input 
                                type="text" 
                                id="username" 
                                name="username" 
                                placeholder="Search by username or ID" 
                            />
                            <input 
                                type="submit" 
                                id='searchProfileBtn' 
                                value="View profile"
                            />
                        </form>
                    </div>
                </div>
                {user.id && <FavoritesList idUser={user.id} username={user.username} isOwnProfile={isOwnProfile} />} 
            </div>
        </div>
    );
};

export default ProfilePage;