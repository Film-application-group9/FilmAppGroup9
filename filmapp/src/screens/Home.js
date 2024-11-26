import { useState, useEffect } from 'react';
import './Home.css';
import axios from 'axios'
import { xmlToJson } from '../showtimes/xmlToJSON.js'
import {Showtimes} from '../showtimes/showtimes.js';

const url = 'http://localhost:3001'

function Home(){
    /*const [showtimes, setShowtimes] = useState([])
    const ajat = 
    setShowtimes()*/
    

    const jsontesti = [
        {
          "id": 1,
          "name": "Matti Meikäläinen",
          "age": 30
        },
        {
          "id": 2,
          "name": "Liisa Virtanen",
          "age": 25
        },
        {
          "id": 3,
          "name": "Kari Korhonen",
          "age": 35
        }
      ]
      

      return (
        <div>
          <h1>Home.js</h1>
          <Showtimes/>
        </div>
      );
    
}

export default Home