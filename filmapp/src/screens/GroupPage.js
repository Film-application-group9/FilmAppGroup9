import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useParams, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';

const url = 'http://localhost:3001'


const GroupPage = () => {

    const AccessMode = Object.freeze({
        Visitor: 'Visitor',
        Member: 'Member',
        Owner: 'Owner'
    });

    const { group_id } = useParams();
    const [groupName, setGroupName] = useState('');
    const [groupUsers, setGroupUsers] = useState([]);
    const [groupMovies, setGroupMovies] = useState([]);
    const [groupShowtimes, setGroupShowtimes] = useState([]);
    const [refresh, setRefresh] = useState(false);

    const [mode, setMode] = useState(AccessMode.Visitor);
    const { userId } = useUser()

    useEffect(() => { //group membership verification case 2=owner, 1=member, 0=visitor
        // const idUser = '1';
        axios.get(url + `/groups/${group_id}/membership/${userId}`)
            .then(response => {
                if (response.status === 200 && response.data.case === 0) {
                    setMode(AccessMode.Visitor)
                }
                else if (response.status === 200 && response.data.case === 1) {
                    setMode(AccessMode.Member)
                }
                else if (response.status === 200 && response.data.case === 2) {
                    setMode(AccessMode.Owner)
                } else {
                    alert('Failed to check membership');
                }
            })
            .catch(error => {
                console.error('Error checking membership:', error);
                alert('Failed to check membership');
            });
    }, [group_id])

    useEffect(() => {
        console.log('Current Mode:', mode);
    }, [mode]);

    useEffect(() => { //groupname
        axios.get(url + `/groups/${group_id}/groupname`)
            .then(response => {
                if (response.status === 200) {
                    setGroupName(response.data.groupname);
                    console.log(response.data.groupname)
                }
                else {
                    alert('Failed to fetch groupname');
                }
            })
            .catch(error => {
                console.error('Error fetching groupname:', error);
                alert('Failed to fetch groupname');
            });
    }, [group_id])

    useEffect(() => { //userlist
        // const idUser = '1';
        axios.get(`http://localhost:3001/groups/${group_id}/users/${userId}`)

            .then(response => {
                if (response.status === 200) {
                    setGroupUsers(response.data);
                    console.log(response.data)
                }
                else {
                    alert('Failed to fetch userlist');
                }
            })
            .catch(error => {
                console.error('Error fetching userlist:', error);
                alert('Failed to fetch userlist');
            });
    }, [group_id, refresh])

    useEffect(() => { //movielist
        // const idUser = '1';
        axios.get(`http://localhost:3001/groups/${group_id}/movies/${userId}`)

            .then(response => {
                if (response.status === 200) {
                    setGroupMovies(response.data);
                    console.log(response.data)
                }
                else {
                    alert('Failed to fetch movielist');
                }
            })
            .catch(error => {
                console.error('Error fetching movielist:', error);
                alert('Failed to fetch movielist');
            });
    }, [group_id])

    useEffect(() => { //showtimes
        // const idUser = '1';
        axios.get(`http://localhost:3001/groups/${group_id}/showtimes/${userId}`)

            .then(response => {
                if (response.status === 200) {
                    setGroupShowtimes(response.data);
                    console.log(response.data)
                }
                else {
                    alert('Failed to fetch showtimes');
                }
            })
            .catch(error => {
                console.error('Error fetching showtimes:', error);
                alert('Failed to fetch showtimes');
            });
    }, [group_id])

    const leaveGroup = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group_id}/leavegroup`, {
                data: { userId }
		    });
            if (response.status === 200) {  
                alert('Left group');
                console.log(response);
                setMode(AccessMode.Visitor);
            } else {
                alert('Failed to leave group');
            }
        } catch (error) {
            console.error('Error leaving group:', error);
            alert('Failed to leave group');
        }
    }

    const removeUser = async (targetUserId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group_id}/removeuser`, {
                data: { userId, targetUserId }
		    });
            if (response.status === 200) {  
                alert('Removed user');
                console.log(response);
                setRefresh((prev) => !prev);
                
            } else {
                alert('Failed to remove user');
            }
        } catch (error) {
            console.error('Error removing user:', error);
            alert('Failed to remove user');
        }
    }

    return (
        <div>
            <div id='groupname'>
                <h1>{groupName}</h1>
            </div>

            {mode === AccessMode.Visitor && (
                <div id='visitorview'>
                    <p> You must be a member of the group the view group contents.</p>
                    <button id='joinGroupButton'>Request to join group</button>
                </div>
            )}

            {(mode === AccessMode.Member || mode === AccessMode.Owner) && (
                
            <div id='memberview'>
                {mode === AccessMode.Member && <button id='leaveGroupButton' onClick={() => leaveGroup()}>Leave group</button>}
                <div id='userlist' style={{ border: '1px solid black', padding: '20px' }}>
                    <h2>Users in group</h2>
                    {
                        groupUsers.map(item => (
                            <li key={item.users_id_user}>
                                {item.username}{mode === AccessMode.Owner && <button id='removeUserButton' onClick={() => removeUser(item.users_id_user)}>Remove user</button> }
                            </li>
                        ))
                    }
                </div>

                <div id='groupmovies' style={{ border: '1px solid black', padding: '20px' }}>
                    <h2>Movie recommendations</h2>
                    {
                        groupMovies.map(item => (
                            <li key={item.id_movie}>
                                {item.moviename}
                            </li>
                        ))
                    }
                </div>

                <div id='showtimes' style={{ border: '1px solid black', padding: '20px' }}>
                    <h2>Coming attractions</h2>
                    {
                        groupShowtimes.map(item => (
                            <li key={item.id_movie}>
                                {item.moviename} {item.showtime}
                            </li>
                        ))
                    }
                </div>
            </div>
                )}

        </div>)
}

export default GroupPage;