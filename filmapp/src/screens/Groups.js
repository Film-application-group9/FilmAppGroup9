import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../context/useUser.js";

const url = 'http://localhost:3001'

const Groups = () => {

    const { username, setUsername } = useUser()  
    const { userId, setUserId} = useUser()
    const navigate = useNavigate();
    const [allGroups, setAllGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
      //  const idUser = '1';
        axios.get(url + `/groups/`)
            .then(response => {
                if (response.status === 200) {
                    setAllGroups(response.data);
                } else {
                    alert('Failed to fetch groups');
                }
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                alert('Failed to fetch groups');
            });
         },);

    const handleNameChange = (e) => setNewGroupName(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        const typeableCharRegex = /[\w!#$%&'*+/=?^_`{|}~-]+/;
        if (!newGroupName || !typeableCharRegex.test(newGroupName)) {
            alert('Please enter a valid name (must include at least one visible character).');
            return;
        }

        axios.post(url + `/groups/creategroup`, {
            userId: userId,
            groupname: newGroupName
          },)
          .then(response => {
            console.log(response.data)
            alert('Created new group: ' + newGroupName);
            const insertedGroupId = response.data.groups_id_group;
            console.log(insertedGroupId)
            navigate('/groups/'+insertedGroupId)
          }).catch(error => {
            alert(error.response.data.error ? error.response.data.error : error)
          })
       };


    return (
        <div>
            <h1>Groups</h1>
            <div id='allgroups'>
                <h3>All groups</h3>
                {
                    allGroups.map(item => (
                        <li key={item.id_group}>
                            <Link to={`/groups/${item.id_group}`} params={{ id: item.id_group }}>{item.groupname}</Link>
                        </li>
                    ))
                }
            </div>

            <div id='create new group form'>

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
                        />
                    </div>
                    <button type="submit">Create group</button>
                </form>

            </div>
        </div>
    );
}

export default Groups;