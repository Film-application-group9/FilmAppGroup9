import React, { useState } from "react";
import axios from "axios";
import '../App.css'
import { useUser } from "../context/useUser.js";

const url = 'http://localhost:3001'

function Logout() {
    const { setUsername, username } = useUser()
    const { setUserId } = useUser()
    const { setToken } = useUser()

    const TextChanging = () => {
        const text1 = "You are logged in as user: "+username
        const text2 = "You are logged out"
        return(<div>{username=="" || username==null ? text2 : text1  }<br></br><br></br></div>)
    }
    
    function handleSubmit() {

        sessionStorage.removeItem('token')
        setUsername('')
        setUserId('')
        setToken('')

    }
    return (
        <div className="container">
            <h2>Logout</h2>
            <TextChanging/>
            {username=="" || username==null ? "": <button type="button" onClick={handleSubmit}>
                Log out
            </button>}
            
        </div>
    );


}
export default Logout;