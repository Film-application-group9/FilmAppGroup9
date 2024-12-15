import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/useUser.js";
import '../styles/Groups.css'

const url = 'http://localhost:3001'

const Groups = () => {

    const { userId, token, updateToken } = useUser()
    const navigate = useNavigate();
    const [allGroups, setAllGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        axios.get(`${url}/groups/`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200) {
                    setAllGroups(response.data);
                    updateToken(response);
                } else {
                    //   alert('Failed to fetch groups');
                }
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                //  alert('Failed to fetch groups');
            });
    }, [])

    const handleNameChange = (e) => setNewGroupName(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        const typeableCharRegex = /[\w!#$%&'*+/=?^_`{|}~-]+/;
        if (!newGroupName || !typeableCharRegex.test(newGroupName)) {
            alert('Please enter a valid name (must include at least one visible character).');
            return;
        }

        axios.post(`${url}/groups/creategroup`,
            {
                userId: userId,
                groupname: newGroupName
            },
            {
                headers: {
                    Authorization: token
                }
            }
        )
            .then(response => {
                if (response.status === 200) {
                    updateToken(response);
                    alert('Created new group: ' + newGroupName);
                    const insertedGroupId = response.data.groups_id_group;
                    navigate('/groups/' + insertedGroupId);
                    setNewGroupName('');
                }
            }).catch(error => {
                alert(error.response.data.error ? error.response.data.error : error)
            })
    };


    return (
        <div id='groups-main'>
             <h1>Browse user groups</h1>
             <div id='groupscontainer'>
                <div id='groupslist'>
                        {
                            allGroups.map(item => (
                                <li key={item.id_group}>
                                    <Link to={`/groups/${item.id_group}`} params={{ id: item.id_group }}>{item.groupname}</Link>
                                </li>
                            ))
                        }
                </div>

                <div id='newgroupform'>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <h3>Create a group</h3>

                            <input
                                placeholder='Enter group name'
                                type="text"
                                id="newGroupName"
                                value={newGroupName}
                                onChange={handleNameChange}
                                required
                                autoComplete="off"
                                maxLength="255"
                            />
                        </div>
                        <button type="submit">Create group</button>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default Groups;