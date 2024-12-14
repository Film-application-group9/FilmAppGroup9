import React from 'react'
import { UserContext } from './UserContext.js';
import { useState } from 'react';

export default function UserProvider({children}) {
    const [token, setToken]  = useState(null)
    const [username, setUsername]  = useState ('')
    const [userId, setUserId] = useState ('')

    const readAuthorizationHeader = (response) => {
        if (response.headers.get('authorization') && 
          response.headers.get('authorization').split(' ')[0] === 'Bearer') {
          return response.headers.get('authorization').split(' ')[1]
        }
    }

    const updateToken = (response => {
        setToken(readAuthorizationHeader(response))
        sessionStorage.setItem('token',readAuthorizationHeader(response))
    })

    return (
        <UserContext.Provider value={{token, setToken, updateToken, username, setUsername, userId, setUserId}}>
            { children }
        </UserContext.Provider>
  )
}
