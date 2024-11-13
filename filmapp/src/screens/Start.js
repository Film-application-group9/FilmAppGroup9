import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import '../App.css'

const url = 'http://localhost:3001'

const Start = () => {
    
    const location = useLocation()
    const username = location.state?.username || 'Guest'
    console.log(username)
    
    
    return (
        <div className="container">
            <h2>Start</h2>
            <p>Welcome {username}</p>
        </div>
    );


}
export default Start;