import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/useUser.js';
import { parseDate } from "../components/parseDate.js"

const GroupComments = () => {

    const { group_id } = useParams();
    const { userId } = useUser();
    const { username } = useUser();
    const [newComment, setNewComment] = useState('');
    const [groupComments, setGroupComments] = useState([]);

    const url = 'http://localhost:3001'

    useEffect(() => { //comments
        fetchComments();
    }, [group_id])


const fetchComments = () => {
    axios.get(`${url}/groups/${group_id}/comments/${userId}`)
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
            <div id='comments' style={{ border: '1px solid black', padding: '20px' }}>
                <h2>Discussion</h2>
                {
                    groupComments.map(item => (
                        <li key={item.comment_time}>
                            {parseDate(item.comment_time)} {item.username} {item.comment_text}
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
                            autoComplete="off" 
                        />
                    </div>
                    <button type="submit">Post comment</button>
                </form>
            </div>
        </div>
    )
}

export default GroupComments;

