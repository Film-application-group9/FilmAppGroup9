import React, { useState } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useUser } from "../context/useUser.js";
import '../App.css'

const url = 'http://localhost:3001'

const Start = () => {
    
    //const location = useLocation()
    //const username = location.state?.username || 'Guest'
    const { username } = useUser()
    const { userId } = useUser()
    const { token } = useUser()
    //console.log(username)
    
    
    return (
        <div className="container">
            <h2>Start</h2>
            <p>Welcome {username} idtesti: your id = {userId} </p>
            <p>token test: {token} </p>
        </div>
    );


}
export default Start;