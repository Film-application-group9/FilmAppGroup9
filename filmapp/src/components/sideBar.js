import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/useUser.js';
import '../styles/sideBar.css';


const SideBar = () => {
  const { token } = useUser();

  return (
    <div className="sidebar">
      <h2>Yet Another FilmApp™</h2>
      <ul>
        <li><Link to="/">Homepage</Link></li>
        <li>{!token && <Link to="/login">Login</Link>}</li>
        <li>{!token &&<Link to="/signup">Register</Link>}</li>
        <li>{token && <Link to="/logout">Logout</Link>}</li>
        <li>{token && <Link to="/deleteAccountTest">Delete Account</Link>}</li>
        <li>{token && <Link to="/groups">Groups</Link>}</li>
        <li>{token && <Link to="/mygroups">My Groups</Link>}</li>
        <li>{token && <Link to="/profiles/me">Profile</Link>}</li>
      </ul>
    </div>
  );
};

export default SideBar;