import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';
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
    let navigate = useNavigate()
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const ToHomepage = async () => {
        await sleep(2500)
        navigate('/')

    }

    useEffect(() => {
        const changePage = async() => {
            ToHomepage()
        }
        changePage()
    })

    
    return (
        <div className="container">
            <h2>Start</h2>
            <p>Welcome {username} idtesti: your id = {userId} </p>
            <p>You will be directed to the homepage</p>
        </div>
    );


}
export default Start;