import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/useUser.js";
import '../styles/Groups.css'


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
                    //   alert('Failed to fetch users groups');
                }
            })
            .catch(error => {
                console.error('Error fetching users groups:', error);
                //   alert('Failed to fetch users groups');
            });
    },[])


    return (
        <div id='main'>
            <h1>My Groups</h1>
            <div id='mygroupslist'>
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