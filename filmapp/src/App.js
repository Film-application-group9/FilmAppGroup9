import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import Signup from './screens/Signup.js';
import Login from './screens/Login.js';
import Logout from './screens/Logout.js';
import Start from './screens/Start.js';

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Register</Link></li>
          <li><Link to="/logout">Logout</Link></li>
        </ul>
      </div>
      <Routes>
        <Route exact path = "/login" element = {<Login/>}/>
        <Route exact path = "/signup" element = {<Signup/>}/>
        <Route exact path = "/logout" element = {<Logout/>}/>
        <Route exact path = "/start" element = {<Start/>}/>
      </Routes>
    </Router>
  );
}

export default App;
