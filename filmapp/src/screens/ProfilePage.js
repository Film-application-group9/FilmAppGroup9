import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';

const ProfilePage = () => {
    const navigate = useNavigate();
    const { token } = useUser() || {};
    const { username } = useParams();
    const [user, setUser] = useState({ username: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const url = username ? `http://localhost:3001/profiles/${username}` : 'http://localhost:3001/profiles/me';
                console.log(`Fetching profile from URL: ${url}`); 
                const headers = username ? {} : { 'Authorization': `Bearer ${token}` };
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
        console.log(`Navigating to profile: /profiles/${searchUsername}`); 
        navigate(`/profiles/${searchUsername}`);
    };

    const profileUrl = username ? `http://localhost:3000/profiles/${username}` : '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl).then(() => {
            alert('Profile link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div>
            <h1>{user.username}'s Profile</h1>
            {user.username && (
                <div>
                    <label>
                        Username:
                        <br />
                        <input
                            style={{ marginLeft: '10px', fontWeight: 'bold' }}
                            type="text"
                            value={user.username} 
                            onChange={(e) => setUser({ ...user, username: e.target.value })}
                            disabled={!!username} 
                        />
                    </label>
                </div>
            )}
            <button onClick={() => navigate(-1)}>Return</button>
            {username && (
                <div>
                    <button onClick={copyToClipboard}>Copy link to profile</button>
                </div>
            )}
            <div>
                <h2 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Search profiles</h2>
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
    );
};

export default ProfilePage;