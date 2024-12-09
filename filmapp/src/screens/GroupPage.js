import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useParams, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';
import GroupComments from '../components/GroupComments.js';

const url = 'http://localhost:3001'


const GroupPage = () => {

    const AccessMode = Object.freeze({
        Visitor: 'Visitor',
        Member: 'Member',
        Owner: 'Owner',
        VisitorPending: 'VisitorPending'
    });

    const navigate = useNavigate();
    const { group_id } = useParams();
    const { userId } = useUser()

    // const [isReady, setIsReady] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupUsers, setGroupUsers] = useState([]);
    const [groupMovies, setGroupMovies] = useState([]);
    const [groupShowtimes, setGroupShowtimes] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [groupComments, setGroupComments] = useState([]);

    const [refresh, setRefresh] = useState(false);

    const [mode, setMode] = useState(AccessMode.Visitor);

    useEffect(() => { //group membership verification case 2=owner, 1=member, 0=visitor
        // const idUser = '1';
        axios.get(url + `/groups/${group_id}/membership/${userId}`)
            .then(response => {
                if (response.status === 200 && response.data.case === 0) {
                    setMode(AccessMode.Visitor)
                    axios.get(url + `/groups/${group_id}/checkrequest/${userId}`)
                        .then(response => {
                            console.log('join req pending: ' + response.data)
                            if (response.status === 200 && response.data === true) {
                                setMode(AccessMode.VisitorPending)
                            }
                        })
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
    }, [group_id, refresh])

    useEffect(() => {
        console.log('Current Mode:', mode);
    }, [mode]);

    useEffect(() => { //groupname
        axios.get(url + `/groups/${group_id}/groupname`)
            .then(response => {
                if (response.status === 200) {
                    setGroupName(response.data.groupname);
                    console.log(response.data.groupname);
                    // setIsReady(true);
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

    useEffect(() => { //joinrequests
        // const idUser = '1';
        axios.get(`http://localhost:3001/groups/${group_id}/pending/${userId}`)

            .then(response => {
                if (response.status === 200) {
                    setJoinRequests(response.data);
                    console.log(response.data)
                }
                else {
                    alert('Failed to fetch join requests');
                }
            })
            .catch(error => {
                console.error('Error fetching join requests:', error);
                alert('Failed to fetch join requests');
            });
    }, [group_id, refresh])

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

    const deleteGroup = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group_id}/removegroup`, {
                data: { userId }
            });
            if (response.status === 200) {
                alert('Group deleted');
                console.log(response);
                navigate('/groups');
            } else {
                alert('Failed to delete group');
            }
        } catch (error) {
            console.error('Error deleting group:', error);
            alert('Failed to delete group');
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

    const sendJoinRequest = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/groups/${group_id}/joinrequest`, {
                userId: userId
            });
            if (response.status === 200) {
                alert('Sent join request to group!');
                console.log(userId)
                console.log(response);
                setRefresh((prev) => !prev);

            } else {
                alert('Failed to send join request');
            }
        } catch (error) {
            console.error('Error sending join request:', error);
            alert('Failed to send join request');
        }
    }

    const acceptJoinRequest = async (targetUserId) => {
        try {
            const response = await axios.post(`http://localhost:3001/groups/${group_id}/acceptrequest`, {
                userId: userId,
                targetUserId: targetUserId
            });
            if (response.status === 200) {
                alert('Accepted join request to group!');
                console.log(userId)
                console.log(response);
                setRefresh((prev) => !prev);

            } else {
                alert('Failed to accept join request');
            }
        } catch (error) {
            console.error('Error accepting join request:', error);
            alert('Failed to accept join request');
        }
    }

    const denyJoinRequest = async (targetUserId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group_id}/denyrequest`, {
                data: { userId, targetUserId }
            });
            if (response.status === 200) {
                alert('Denied join request');
                console.log(userId)
                console.log(response);
                setRefresh((prev) => !prev);

            } else {
                alert('Failed to deny join request');
            }
        } catch (error) {
            console.error('Error denying join request:', error);
            alert('Failed to deny join request');
        }
    }

    return (
        <div>
            <div id='groupname'>
                <h1>{groupName}</h1>
            </div>

            {(mode === AccessMode.Visitor || mode === AccessMode.VisitorPending) && (
                <div id='visitor view'>
                    <p> You must be a member of the group the view group contents.</p>
                    {mode === AccessMode.Visitor && <button id='joinGroupButton' onClick={() => sendJoinRequest()}>Request to join group</button>}
                    {mode === AccessMode.VisitorPending && <button id='disabledJoinGroupButton' disabled>Join request pending</button>}
                </div>
            )}

            {(mode === AccessMode.Member || mode === AccessMode.Owner) && (

                <div id='member and owner view'>
                    {mode === AccessMode.Member && <button id='leaveGroupButton' onClick={() => leaveGroup()}>Leave group</button>}
                    {mode === AccessMode.Owner && <button id='leaveGroupButton' onClick={() => deleteGroup()}>Delete group</button>}
                    {mode === AccessMode.Owner && <button id='navButton' onClick={() => navigate('/groups')}>Back to Groups</button>}
                    {mode === AccessMode.Owner && (

                        <div id='pendingrequests' style={{ border: '1px solid black', padding: '20px' }}>
                            <h2>Pending requests to join group</h2>
                            {
                                joinRequests.map(item => (
                                    <li key={item.id_user}>
                                        {item.username}<button id='acceptRequestButton' onClick={() => acceptJoinRequest(item.id_user)}>Accept</button>
                                        <button id='denyRequestButton' onClick={() => denyJoinRequest(item.id_user)}>Deny</button>
                                    </li>
                                ))
                            }
                        </div>)}

                    <div id='userlist' style={{ border: '1px solid black', padding: '20px' }}>
                        <h2>Users in group</h2>
                        {
                            groupUsers.map(item => (
                                <li key={item.users_id_user}>
                                    {item.username}{item.is_owner && "👑"}{mode === AccessMode.Owner && !item.is_owner && (<button id='removeUserButton' onClick={() => removeUser(item.users_id_user)}>Remove user</button>)}
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

                    <div id='comments'>
                    <GroupComments />
                    </div>

                </div>


            )}

        </div>)
}

export default GroupPage;