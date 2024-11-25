import React from 'react'
import axios from 'axios';
import { useUser } from '../context/useUser';

export default function TokenTest() {
  const { token } = useUser()
  const { updateToken } = useUser()
  function handleSubmit() {
    axios.get('http://localhost:3001/user/', {
      headers: {
        Authorization: token//sessionStorage.getItem('token')
    } 
    })
    .then (response => {
      console.log(response.data)
      updateToken(response)
    }).catch(error => {
      alert(error)
    })

  }
  
  
  return (
    <div className="container">
        <h2>get Accounts</h2>
        <button type="button" onClick={handleSubmit}>
            test
        </button>
    </div>
);
}
