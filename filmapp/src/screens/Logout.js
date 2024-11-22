import React, { useState } from "react";
import axios from "axios";
import '../App.css'
import { useUser } from "../context/useUser";

const url = 'http://localhost:3001'

function Logout() {
    const { setUsername } = useUser()
    const { setUserId} = useUser()
    function handleSubmit() {

        sessionStorage.removeItem('token')
        setUsername('')
        setUserId('')

    }
    return (
        <div className="container">
            <h2>Logout</h2>
            <button type="button" onClick={handleSubmit}>
                Log out
            </button>
        </div>
    );


}
export default Logout;