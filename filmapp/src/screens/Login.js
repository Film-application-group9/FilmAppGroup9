import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css'
import { useUser } from "../context/useUser.js";

const url = 'http://localhost:3001'

function Login() {
    const navigate = useNavigate()
    const { token, setToken } = useUser()
    const { username, setUsername } = useUser()  
    //const { password, setPassword} = useUser()
    const { userId, setUserId} = useUser()
    //const [username, setUsername]  = useState ('')
    const [password, setPassword]  = useState ('')
    function handleSubmit() {
        
        
      
        console.log(username)
        console.log(password)
        axios.post(url + '/user/login', {
            username: username,
            password: password
          },)
          .then(response => {
            console.log(response)
            console.log(response.data)
            //console.log(response.data.token)
            //sessionStorage.setItem('token', response.data.token)
            //sessionStorage.setItem('username',response.data.username)
            //setToken(response.data.token)
            setToken(readAuthorizationHeader(response))
            setUserId(response.data.id)
            //console.log("Login-userID: ", )
            sessionStorage.setItem('token', readAuthorizationHeader(response))
            //navigate('/start',{state: {username: username}})
            navigate('/start')
                
          }).catch(error => {
            //alert(error.response.data.error ? error.response.data.error : error)
            alert("Wrong username/password")
            setPassword('')
          })
        }
        
        const readAuthorizationHeader = (response) => {
            if (response.headers.get('authorization') && 
              response.headers.get('authorization').split(' ')[0] === 'Bearer') {
              return response.headers.get('authorization').split(' ')[1]
            }
          }
      
        return (
            <div>  
                <form>
                    <h2>Login</h2>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="email"
                            id="username"
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="button-container">
                        <button type="button" onClick={handleSubmit}>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        );
        

}
export default Login;