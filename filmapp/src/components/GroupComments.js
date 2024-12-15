import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';
import { parseDate } from "../components/parseDate.js"

const GroupComments = () => {

    const { group_id } = useParams();
    const { userId, username, token, updateToken } = useUser();
    const [newComment, setNewComment] = useState('');
    const [groupComments, setGroupComments] = useState([]);

    const url = 'http://localhost:3001'

    useEffect(() => {
        fetchComments();
    }, [group_id])


    const fetchComments = () => {
        axios.get(`${url}/groups/${group_id}/comments/${userId}`, {
            headers: { Authorization: token }
        })
            .then(response => {
                if (response.status === 200) {
                    updateToken(response);
                    setGroupComments(response.data);
                    
                }
                else {
                    alert('Failed to fetch group comments');
                }
            })
            .catch(error => {
                console.error('Error fetching group comments:', error);
            });
    }

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
            commentText: newComment,
            username: username
        },
            {
                headers: { Authorization: token }
            },)
            .then(response => {
                console.log(response.data)
                alert('Posted comment');
                fetchComments();
                setNewComment('');
            }).catch(error => {
                alert('Error posting comment')
                console.log('Error posting comment', error)
            })
    };

    return (
        <div>
            <div id='comments-container'>
                <h2>Discussion</h2>
                {
                    groupComments.map(item => (

                        <li key={item.comment_time}>
                            <div id='comments-message'>
                                <div> <b>{item.username}</b> {parseDate(item.comment_time)}</div>
                                <div> {item.comment_text}</div>
                            </div>
                        </li>
                    ))
                }
            </div>


            <div id='comments-form'>
                <form onSubmit={handleSubmit}>

                        <h3>Post comment to group</h3>
                        <textarea
                            placeholder='Enter your comment...'
                            maxLength="280"
                            id="newComment"
                            value={newComment}
                            onChange={handleCommentChange}
                            required
                            autoComplete="off"
                        ></textarea>

                    <button type="submit">Post comment</button>
                </form>
            </div>
        </div>
    )
}

export default GroupComments;

