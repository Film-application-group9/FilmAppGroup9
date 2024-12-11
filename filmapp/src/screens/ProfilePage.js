import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/useUser.js";

const ProfilePage = () => {
    const navigate = useNavigate();
    const { token } = useUser();
    const { username } = useParams();
    const [user, setUser] = useState({ username: '', email: '', bio: ''});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const url = username ? `http://localhost:3001/profiles/${username}` : 'http://localhost:3001/profiles/me';
                const headers = username ? {} : { 'Authorization': `Bearer ${token}` };
                const response = await axios.get(url, { headers });
                if (response.status === 200) {
                    setUser(response.data);
                } else {
                    alert('Failed to fetch profile');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                alert('Failed to fetch profile');
            }
        };

        fetchProfile();
    }, [token, username]);

    const handleUpdate = async () => {
        try {
            const response = await axios.patch('http://localhost:3001/profiles/me', user, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                alert('Profile updated successfully');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };

    return (
        <div>
            <h1>Profile</h1>
            <label>
                Username:
                <input
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    disabled={!!username} 
                />
            </label>
            <label>
                Email:
                <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    disabled={!!username} // Disable editing if viewing another user's profile
                />
            </label>
            <label>
                Bio:
                <textarea
                    value={user.bio}
                    onChange={(e) => setUser({ ...user, bio: e.target.value })}
                    disabled={!!username} // Disable editing if viewing another user's profile
                />
            </label>
            
            {!username && <button onClick={handleUpdate}>Update Profile</button>}
            <button onClick={() => navigate(-1)}>Return</button>
                <div>
                    <h2>Search profiles</h2>
                    <input type="text" id="username" placeholder="Search by username" />
                    <button type="button" onClick={() => navigate(`/profiles/${document.getElementById('username').value}`)}>
                        Search
                    </button>
                </div>
            </div>
        );
    };

export default ProfilePage;