import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../App.css'
import { useUser } from "../context/useUser";

const url = 'http://localhost:3001'

function Login() {
    const navigate = useNavigate()
    const { setToken } = useUser()
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
            console.log(response.data)
            console.log(response.data.token)
            sessionStorage.setItem('token', response.data.token)
            //sessionStorage.setItem('username',response.data.username)
            setToken(response.data.token)
            setUserId(response.data.id)
            navigate('/start',{state: {username: username}})

          }).catch(error => {
            //alert(error.response.data.error ? error.response.data.error : error)
            alert("Wrong username/password")
            setPassword('')
          })
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