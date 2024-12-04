import { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios'
import { xmlToJson } from '../showtimes/xmlToJSON.js'
import {Showtimes} from '../showtimes/showtimes.js';
import Reviews from './Reviews.js';

const url = 'http://localhost:3001'

function Home(){
    /*const [showtimes, setShowtimes] = useState([])
    const ajat = 
    setShowtimes()*/
    


      return (
        <div>
          <h1>Home.js</h1>
          <Reviews/>
        </div>
      );
    
}

export default Home