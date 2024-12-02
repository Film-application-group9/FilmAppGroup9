import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useParams, BrowserRouter } from 'react-router-dom';
import axios from 'axios';


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
    const [mode, setMode] = useState(AccessMode.Visitor);


      useEffect(() => { //group membership verification case 2=owner, 1=member, 0=visitor
        const idUser = '1';
        axios.get( url + `/groups/${group_id}/membership/${idUser}`)
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
            axios.get( url + `/groups/${group_id}/groupname`)
            .then(response => {
                if (response.status === 200) {
                    setGroupName(response.data.groupname);
                    console.log(response.data.groupname)
                } else {
                    alert('Failed to fetch groupname');
                }
            })
            .catch(error => {
                console.error('Error fetching groupname:', error);
                alert('Failed to fetch groupname');
            });
        }, [group_id])

        useEffect(() => { //userlist
            const idUser = '1';
            axios.get(`http://localhost:3001/groups/${group_id}/users/${idUser}`)
            
            .then(response => {
                if (response.status === 200) {
                    setGroupUsers(response.data);
                    console.log(response.data)
                } else {
                    alert('Failed to fetch userlist');
                }
            })
            .catch(error => {
                console.error('Error fetching userlist:', error);
                alert('Failed to fetch userlist');
            });
        }, [group_id])

    return (
        <div>
            <div id='groupname'>
            <h1>{groupName}</h1> 
            </div>
       
            <div id='users' style={{ border: '1px solid black', padding: '20px' }}>
            <h2>Users in group</h2>
            {
            groupUsers.map(item => (
                <li key={item.users_id_user}>
                        {item.username}
                </li>
            ))
            }
            </div>

      </div>)
    }

export default GroupPage;