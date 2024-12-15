import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';
import GroupComments from '../components/GroupComments.js';
import { parseDate } from "../components/parseDate.js"
import '../styles/GroupPage.css'

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
    const { userId, token, updateToken } = useUser()

    // const [isReady, setIsReady] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupUsers, setGroupUsers] = useState([]);
    const [groupMovies, setGroupMovies] = useState([]);
    const [groupShowtimes, setGroupShowtimes] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);
    const [mode, setMode] = useState(AccessMode.Visitor);

    useEffect(() => { //group membership verification case 2=owner, 1=member, 0=visitor
        checkMembershipStatus();
    }, [group_id, userId])

    useEffect(() => { //accessmode debug
        console.log('Current Mode:', mode);
    }, [mode]);

    useEffect(() => { //groupname
        fetchGroupName();
    }, [group_id])

    useEffect(() => { //userlist
        fetchUserlist();
    }, [group_id, userId])

    useEffect(() => { //movielist
        fetchMovielist();
    }, [group_id, userId])

    useEffect(() => { //showtimes
        fetchShowtimes();
    }, [group_id, userId])

    useEffect(() => { //joinrequests
        fetchJoinRequests();
    }, [group_id, userId])

    const checkMembershipStatus = () => {
        axios.get(`${url}/groups/${group_id}/membership/${userId}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200 && response.data.case === 0) {
                    updateToken(response);
                    setMode(AccessMode.Visitor)
                    checkRequestPending();
                }
                else if (response.status === 200 && response.data.case === 1) {
                    updateToken(response);
                    setMode(AccessMode.Member)
                }
                else if (response.status === 200 && response.data.case === 2) {
                    updateToken(response);
                    setMode(AccessMode.Owner)
                } else {
                    alert('Failed to check membership');
                }
            })
            .catch(error => {
                console.error('Error checking membership:', error);
            });
    }

    const checkRequestPending = () => {
        axios.get(`${url}/groups/${group_id}/checkrequest/${userId}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                console.log('join req pending: ' + response.data)
                if (response.status === 200 && response.data === true) {
                    updateToken(response);
                    setMode(AccessMode.VisitorPending)
                }
            })
    }

    const fetchGroupName = () => {
        axios.get(`${url}/groups/${group_id}/groupname`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200 && response.data.length !== 0) {
                    updateToken(response);
                    setGroupName(response.data.groupname);
                    console.log(response.data.groupname);
                }
                else {
                    console.error('Failed to fetch groupname');
                }
            })
            .catch(error => {
                console.error('Error fetching groupname:', error);
            });
    }

    const fetchUserlist = () => {
        axios.get(`${url}/groups/${group_id}/users/${userId}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200) {
                    updateToken(response);
                    setGroupUsers(response.data);
                    console.log(response.data);
                }
                else {
                    console.error('Failed to fetch userlist');
                }
            })
            .catch(error => {
                console.error('Error fetching userlist:', error);
            });
    }

    const fetchMovielist = () => {
        axios.get(`${url}/groups/${group_id}/movies/${userId}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200) {
                    updateToken(response);
                    setGroupMovies(response.data);
                    console.log(response.data)
                }
                else {
                    console.error('Failed to fetch movielist');
                }
            })
            .catch(error => {
                console.error('Error fetching movielist:', error);
            });
    }

    const fetchShowtimes = () => {
        axios.get(`${url}/groups/${group_id}/showtimes/${userId}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200) {
                    updateToken(response);
                    setGroupShowtimes(response.data);
                    console.log(response.data)
                }
                else {
                    console.error('Failed to fetch showtimes');
                }
            })
            .catch(error => {
                console.error('Error fetching showtimes:', error);
            });
    }

    const fetchJoinRequests = () => {
        axios.get(`${url}/groups/${group_id}/pending/${userId}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200 && response.data.length > 0) {
                    updateToken(response);
                    setJoinRequests(response.data);
                    console.log(response.data)
                } else {
                    updateToken(response);
                    setJoinRequests([]);
                }
            })
            .catch(error => {
                console.error('Error fetching join requests:', error);
            });
    }

    const leaveGroup = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group_id}/leavegroup`, {
                headers: {
                    Authorization: token
                },
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
        }
    }

    const deleteGroup = async () => {
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group_id}/removegroup`, {
                headers: {
                    Authorization: token
                },
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
        }
    }

    const removeUser = async (targetUserId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group_id}/removeuser`, {
                headers: {
                    Authorization: token
                },
                data: { userId, targetUserId }
            });
            if (response.status === 200) {
                alert('Removed user');
                console.log(response);
                fetchUserlist();
            } else {
                alert('Failed to remove user');
            }
        } catch (error) {
            console.error('Error removing user:', error);
        }
    }

    const sendJoinRequest = async () => {
        try {
            const response = await axios.post(`http://localhost:3001/groups/${group_id}/joinrequest`, {
                userId: userId
            },
                { headers: { Authorization: token } }
            )
            if (response.status === 200) {
                alert('Sent join request to group!');
                console.log(userId)
                console.log(response);
                checkRequestPending();
            } else {
                alert('Failed to send join request');
            }
        } catch (error) {
            console.error('Error sending join request:', error);
        }
    }

    const acceptJoinRequest = async (targetUserId) => {
        try {
            const response = await axios.post(`http://localhost:3001/groups/${group_id}/acceptrequest`, {
                userId: userId,
                targetUserId: targetUserId
            },
                { headers: { Authorization: token } }
            )
            if (response.status === 200) {
                alert('Accepted join request to group!');
                console.log(userId)
                console.log(response);
                fetchUserlist();
                fetchJoinRequests();
            } else {
                alert('Failed to accept join request');
            }
        } catch (error) {
            console.error('Error accepting join request:', error);
        }
    }

    const denyJoinRequest = async (targetUserId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/groups/${group_id}/denyrequest`, {
                headers: {
                    Authorization: token
                },
                data: { userId, targetUserId }
            });
            if (response.status === 200) {
                alert('Denied join request');
                console.log(userId)
                console.log(response);
                fetchJoinRequests();
            } else {
                alert('Failed to deny join request');
            }
        } catch (error) {
            console.error('Error denying join request:', error);
        }
    }


    return (
        <div id='group-page-main'>
            <div id='groupname'>
                <h1>{groupName}</h1>
            </div>

            {(mode === AccessMode.Visitor || mode === AccessMode.VisitorPending) && (
                <div id='visitor view'>
                    <p> You must be a member of the group the view group contents.</p>
                    {mode === AccessMode.Visitor && <button id='joinGroupButton' onClick={() => sendJoinRequest()}>Request to join group</button>}
                    {mode === AccessMode.Visitor && <button id='navButton' onClick={() => navigate('/groups')}>Back to Groups</button>}
                    {mode === AccessMode.VisitorPending && <button id='disabledJoinGroupButton' disabled>Join request pending</button>}
                </div>
            )}

            {(mode === AccessMode.Member || mode === AccessMode.Owner) && (

                <div id='member and owner view'>
                    {mode === AccessMode.Member && <button id='leaveGroupButton' onClick={() => leaveGroup()}>Leave group</button>}
                    {mode === AccessMode.Owner && <button id='deleteGroupButton' onClick={() => deleteGroup()}>Delete group</button>}
                    <button id='navButton' onClick={() => navigate('/groups')}>Back to Groups</button>
                    {mode === AccessMode.Owner && (

                        <div id='pendingrequests'>
                            <h2>Pending requests to join group</h2>

                            {joinRequests.length === 0 ? (
                                <div>{<i>No requests</i>}</div>) : (<div>
                                {
                                    joinRequests.map(item => (
                                        <li key={item.id_user}>
                                            {item.username}<button id='acceptRequestButton' onClick={() => acceptJoinRequest(item.id_user)}>Accept</button>
                                            <button id='denyRequestButton' onClick={() => denyJoinRequest(item.id_user)}>Deny</button>
                                        </li>
                                    ))
                                }</div>)}
                        </div>)}

                    <div id='userlist'>
                        <h2>Users in group</h2>
                        {
                            groupUsers.map(item => (
                                <li key={item.users_id_user}>
                                    {item.username}{item.is_owner && "👑"}{mode === AccessMode.Owner && !item.is_owner && (<button id='removeUserButton' onClick={() => removeUser(item.users_id_user)}>Remove user</button>)}
                                </li>
                            ))
                        }
                    </div>

                    <div id='groupmovies'>
                        <h2>Movie recommendations</h2>
                        <div id='moviecardscontainer'>
                            {
                                groupMovies.map(item => (
                                    <div className='moviecard' key={item.id_movie} onClick={() => navigate(`/movies?id=${item.id_movie}`)}>
                                        <img src={(`https://image.tmdb.org/t/p/w200/${item.img_path}`)} alt='Poster' />
                                        <div className='moviecardtext'>
                                            <div><b>{item.moviename}</b></div>
                                            <div>{item.moviename !== item.moviename_original && ` (${item.moviename_original})`}</div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <div id='grouppageshowtimes'>
                        <h2>Coming attractions</h2>
                        {
                            <table id='showtimestable'>
                                <tbody>
                                    {groupShowtimes.map(item => (
                                        <tr>
                                            <td>{item.moviename_finnish}{item.moviename_finnish !== item.moviename_original && ` (${item.moviename_original})`}</td>
                                            <td>{item.place}</td>
                                            <td>{parseDate(item.showtime)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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