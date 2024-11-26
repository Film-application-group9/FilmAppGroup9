import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import Signup from './screens/Signup.js';
import Login from './screens/Login.js';
import Logout from './screens/Logout.js';
import Start from './screens/Start.js';
import UserProvider from './context/UserProvider.js';
import DeleteAccountTest from './screens/DeleteAccountTest.js';
import TokenTest from './screens/tokenTest.js';
import FavoritesList from './screens/FavoritesList.js';
import MovieSearch from './components/MovieSearch.js';
import React from 'react';



function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Register</Link></li>
            <li><Link to="/logout">Logout</Link></li>
            <li><Link to="/deleteAccountTest">Delete Account</Link></li>
            <li><Link to="/tokenTest">Get accounts</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            
          </ul>
        </div>
        <Routes>
          <Route exact path = "/login" element = {<Login/>}/>
          <Route exact path = "/signup" element = {<Signup/>}/>
          <Route exact path = "/logout" element = {<Logout/>}/>
          <Route exact path = "/start" element = {<Start/>}/>
          <Route exact path = "/deleteAccountTest" element = {<DeleteAccountTest/>}/>
          <Route exact path = "/tokenTest" element = {<TokenTest/>}/>
          <Route exact path="/" element={<MovieSearch />} />
          <Route exact path="/favorites" element={<FavoritesList />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App;