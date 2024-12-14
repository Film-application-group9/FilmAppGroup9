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
import Groups from './screens/Groups.js';
import MyGroups from './screens/MyGroups.js';
import GroupPage from './screens/GroupPage.js';
import ProfilePage from './screens/ProfilePage.js';
import React from 'react';
import Reviews from './screens/Reviews.js';

function App() {
  return (
    <div className="div-main">

      <UserProvider>
        <Router>

          <div>
            {/* 
          <ul>
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Register</Link></li>
            <li><Link to="/logout">Logout</Link></li>
            <li><Link to="/deleteAccountTest">Delete Account</Link></li>
            <li><Link to="/tokenTest">Get accounts</Link></li>
            <li><Link to="/favorites">Favorites</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/mygroups">My Groups</Link></li>
          </ul>
*/}
            <div className="sidebar">
              <h2>Yet Another FilmApp™</h2>
              <ul>
                <li><Link to="/">Homepage</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Register</Link></li>
                <li><Link to="/logout">Logout</Link></li>
                <li><Link to="/deleteAccountTest">Delete Account</Link></li>
                <li><Link to="/favorites">Favorites</Link></li>
                <li><Link to="/groups">Groups</Link></li>
                <li><Link to="/mygroups">My Groups</Link></li>
                <li><Link to="/profiles/me">Profile</Link></li>
              </ul>
            </div>
          </div>


          <div>
            <div className="main-content">
              <Routes>
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/logout" element={<Logout />} />
                <Route exact path="/start" element={<Start />} />
                <Route exact path="/deleteAccountTest" element={<DeleteAccountTest />} />
                <Route exact path="/tokenTest" element={<TokenTest />} />
                <Route exact path="/" element={<MovieSearch />} />
                <Route exact path="/favorites" element={<FavoritesList />} />
                <Route exact path="/movies" element={<Reviews />} />
                <Route exact path="/groups" element={<Groups />} />
                <Route exact path="/mygroups" element={<MyGroups />} />
                <Route exact path="/groups/:group_id" element={<GroupPage />} />
                <Route exact path="/profiles/:username" element={<ProfilePage />} />
                <Route exact path="/profiles/me" element={<ProfilePage />} />
              </Routes>

            </div>
          </div>
        </Router>
      </UserProvider>
    </div>
  )
}

export default App;