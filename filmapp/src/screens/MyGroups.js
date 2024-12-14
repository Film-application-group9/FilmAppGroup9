import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/useUser.js";


const url = 'http://localhost:3001'

const MyGroups = () => {

    const { userId, token, updateToken } = useUser()
    const navigate = useNavigate();
    const [mygroups, setMyGroups] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:3001/groups/mygroups/${userId}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200) {
                    updateToken(response);
                    setMyGroups(response.data);
                } else {
                    
                }
            })
            .catch(error => {
                console.error('Error fetching users groups:', error);
            });
    },[])


    return (
        <div>
            <h1>Groups</h1>
            <div id='mygroups'>
                <h3>My groups</h3>
                {
                    mygroups.map(item => (
                        <li key={item.id_group}>
                            <Link to={`/groups/${item.id_group}`} params={{ id: item.id_group }}>{item.groupname}</Link>
                        </li>
                    ))
                }
            </div>
        </div>
    );
}

export default MyGroups;