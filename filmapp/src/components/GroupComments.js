import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useParams, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';


const GroupComments = () => {


    const navigate = useNavigate();
    const { group_id } = useParams();
    const { userId } = useUser();
    const [newComment, setNewComment] = useState('');

    // const [isReady, setIsReady] = useState(false);

    const [groupComments, setGroupComments] = useState([]);

    const [refresh, setRefresh] = useState(false);

    const url = 'http://localhost:3001'

    useEffect(() => { //comments
        // const idUser = '1';
        axios.get(`http://localhost:3001/groups/${group_id}/comments/${userId}`)

            .then(response => {
                if (response.status === 200) {
                    setGroupComments(response.data);
                    console.log(response.data)
                }
                else {
                    alert('Failed to fetch group comments');
                }
            })
            .catch(error => {
                console.error('Error fetching group comments:', error);
                alert('Failed to fetch group comments');
            });
    }, [group_id, refresh])


    const handleCommentChange = (e) => setNewComment(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        const typeableCharRegex = /[\w!#$%&'*+/=?^_`{|}~-]+/;
        if (!newComment || !typeableCharRegex.test(newComment)) {
            alert('Please enter a valid comment.');
            return;
        }

        axios.post(url + `/groups/${group_id}/addcomment`, {
            userId: userId,
            commentText: newComment
        },)
            .then(response => {
                console.log(response.data)
                alert('Posted comment');
                setRefresh((prev) => !prev);
            }).catch(error => {
                alert(error.response.data.error ? error.response.data.error : error)
            })
    };

    const parseDate = (isoString) => {
        const date = new Date(isoString);

        // Format date and time
        const formattedDate = date.toLocaleDateString('en-GB'); // dd/mm/yyyy
        const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); // hh:mm

        return `${formattedDate.replace(/\//g, '.')} ${formattedTime}`;
    };

    return (
        <div>
            <div id='comments' style={{ border: '1px solid black', padding: '20px' }}>
                <h2>Discussion</h2>
                {
                    groupComments.map(item => (
                        <li key={item.comment_time}>
                            {parseDate(item.comment_time)} {item.id_user} {item.comment_text}
                        </li>
                    ))
                }
            </div>


            <div id='post comment form'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <h3>Post comment to group</h3>

                        <input
                            placeholder='Enter your comment...'
                            maxlength="280"
                            type="text"
                            id="newComment"
                            value={newComment}
                            onChange={handleCommentChange}
                            required
                        />
                    </div>
                    <button type="submit">Post comment</button>
                </form>
            </div>
        </div>
    )
}

export default GroupComments;

