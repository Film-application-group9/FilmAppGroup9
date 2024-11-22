import React from 'react'
import { UserContext } from './UserContext.js';
import { useState } from 'react';

export default function UserProvider({children}) {
    const [token, setToken]  = useState(null)
    const [username, setUsername]  = useState ('')
    //const [password, setPassword]  = useState ('')
    const [userId, setUserId] = useState ('')
    return (
        <UserContext.Provider value={{token, setToken, username, setUsername, userId, setUserId}}>
            { children }
        </UserContext.Provider>
  )
}
