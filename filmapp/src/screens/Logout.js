import React, { useState } from "react";
import axios from "axios";
import '../App.css'

const url = 'http://localhost:3001'

function Logout() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    function handleSubmit() {

        sessionStorage.removeItem('token')

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