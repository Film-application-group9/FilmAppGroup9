import React, { useState } from "react";
import axios from 'axios';
import { useUser } from '../context/useUser.js';



const url = 'http://localhost:3001'

const DeleteAccountTest = () => {
    const { userId } = useUser()
    const { token } = useUser()
    function handleSubmit() {
        //console.log(userId)
        axios.delete(url + '/user/delete/' + userId, {
            headers: {
                Authorization: token//sessionStorage.getItem('token')
            }        
        })
        .then (response => {
            console.log(response)
            alert("Käyttäjä poistettu")
        }).catch (error => {
            console.log(error)
        })
    

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
