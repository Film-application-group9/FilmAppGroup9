import React, { useState } from "react";
import axios from 'axios';
import { useUser } from '../context/useUser.js';



const url = 'http://localhost:3001'

const DeleteAccountTest = () => {
    const { userId } = useUser()
    const { token } = useUser()
    const { setUsername } = useUser()
    const { setUserId } = useUser()
    const { setToken } = useUser()
    function handleSubmit() {
        axios.delete(url + '/user/delete/' + userId, {
            headers: {
                Authorization: token
            }        
        })
        .then (response => {
            console.log(response)
            alert("Käyttäjä poistettu")
        }).catch (error => {
            console.log(error)
        })
        sessionStorage.removeItem('token')
        setUsername('')
        setUserId('')
        setToken('')
    

    }
    return (
        <div className="container">
            <h2>Delete account</h2>
            <button type="button" onClick={handleSubmit}>
                Delete
            </button>
        </div>
    );
}

export default DeleteAccountTest;
