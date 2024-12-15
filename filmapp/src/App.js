import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import SideBar from './components/sideBar.js';

function App() {
  return (
    <div id="app-div-main">
      <UserProvider>
        <Router>
          <SideBar />
          <div id="app-main-content">
            <Routes>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/start" element={<Start />} />
              <Route exact path="/deleteAccountTest" element={<DeleteAccountTest />} />
              <Route exact path="/tokenTest" element={<TokenTest />} />
              <Route exact path="/" element={<MovieSearch />} />
              <Route exact path="/favorites" element={<FavoritesList />} />
              <Route exact path="/favorites/:username" element={<FavoritesList />} />
              <Route exact path="/movies" element={<Reviews />} />
              <Route exact path="/groups" element={<Groups />} />
              <Route exact path="/mygroups" element={<MyGroups />} />
              <Route exact path="/groups/:group_id" element={<GroupPage />} />
              <Route exact path="/profiles/:username" element={<ProfilePage />} />
              <Route exact path="/profiles/me" element={<ProfilePage />} />
            </Routes>
          </div>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
