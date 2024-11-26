import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const url = 'http://localhost:3001'

function Signup() {

    
    const navigate = useNavigate()
    const [username, setUsername]  = useState ('')
    const [password, setPassword]  = useState ('')
    function handleSubmit() {
        
        const passwordValidation = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!passwordValidation.test(password)) {
            alert("Password should be at least 8 characters and it should contain at least one capital letter and one number");
            return;
    }
      
        console.log(username)
        console.log(password)
        axios.post(url + '/user/register', {
            username: username,
            password: password
          },)
          .then(response => {
            console.log(response.data)
            navigate('/login')
            
          }).catch(error => {
            alert(error.response.data.error ? error.response.data.error : error)
          })
        }
      
      
        return (
            <div> 
                <form>
                    <h2>Register</h2>
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
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="button-container">
                        <button type="button" onClick={handleSubmit}>
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        );
        
        

}
export default Signup;