import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/useUser.js";


const url = 'http://localhost:3001'

const MyGroups = () => {

    const { username, setUsername } = useUser()  
    const { userId, setUserId} = useUser()
    const navigate = useNavigate();
    const [mygroups, setMyGroups] = useState([]);


    useEffect(() => {
      //  const idUser = '1';
        axios.get(`http://localhost:3001/groups/mygroups/${userId}`)
            .then(response => {
                if (response.status === 200) {
                    setMyGroups(response.data);
                } else {
                 //   alert('Failed to fetch users groups');
                }
            })
            .catch(error => {
                console.error('Error fetching users groups:', error);
             //   alert('Failed to fetch users groups');
            });
         },);


return (
    <div>
         <h1>Groups</h1>
         <div id='mygroups'>
         <h3>My groups</h3>
          {
            mygroups.map(item => (
                <li key={item.id_group}>
                        <Link to={`/groups/${item.id_group}`} params={{id: item.id_group}}>{item.groupname}</Link>
                </li>
            ))
          }
        </div>
    </div>
);
}

export default MyGroups;