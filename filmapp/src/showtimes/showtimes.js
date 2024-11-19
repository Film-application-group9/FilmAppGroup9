import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { xmlToJson } from './xmlToJSON.js'
import { AreaList, PVM, AreaID, AlueBool } from './params.js'
import { JSONtoList } from './JSONtoList.js'
import "./showtime.css"


const Showtimes = () =>{
    const [json, setJson] = useState(null)
    const [error, setError] = useState(null)
    const [dt, setDt]=useState(null)
    const [areaID, setAreaID]=useState(1029)

    const arealist = AreaList()
    const dateList = PVM()

    const [alueBool, setAlueBool]=useState(true)




    const axiosShowtimes = async (a, d) => {
      try {
        // Axios-pyyntö Finnkino API:lle
        let response = await axios.get('https://www.finnkino.fi/xml/Schedule/', {
          params: { area: a,
                    dt: d }
                    
        });
        console.log(a,d)
        return xmlToJson(response.data) // Asetetaan saatu data tilaan// Lataus valmis
      } catch (error) {
        console.error(error);
        setError(error);  // Virheen käsittely
      }
    };

    useEffect(() => {
      // Määritellään asynkroninen funktio
      const fetchShowtimes = async () => {
        const showtimesData = await axiosShowtimes(areaID, dt); // Kutsutaan axiosShowtimes
        setJson(showtimesData);  // Asetetaan saatu JSON-tieto tilaan
      };
  
        fetchShowtimes(); // Suoritetaan asynkroninen funktio
    }, [areaID, dt]);


    const AreaMuutos = (e) =>{

      const area = e.target.value
      AlueBool1(AreaID(area))
      setAreaID(AreaID(area))
      
    }

    const DateMuutos = (e) =>{

      setDt(e.target.value)

    }

    const AlueBool1 = (id) => {
      const alueet = [1014, 1029,1012,1002,1021]
      if(alueet.includes(id)){
          setAlueBool(true)
      }else{
          setAlueBool(false)
      }
  }

  const Table = () => {
    if(json == null){
      return(<div><p>Loading...</p></div>)
    }else {
    const obj = JSONtoList(json, alueBool)
    
    return(
      <table>
        <tbody>
          {obj.map(elokuva => (
            <tr>
              <td>{elokuva.Time}</td>
              <td>{elokuva.Title}</td>
              <td>{elokuva.Place}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  }


    return(
      <div>
        <select id="date" onChange={DateMuutos}>
            <option value={""}>Tänään</option> {}
            {dateList.map((option, index) => (
            <option key={index} value={option}>
            {option}
          </option>
        ))}
            </select>
            <select id="area" onChange={AreaMuutos}>
            <option value="Kaikki teatterit">Kaikki teatterit</option> {}
            {arealist.map((option, index) => (
            <option key={index} value={option}>
            {option}
          </option>
        ))}
            </select>
      <div id="Showtimes"><Table/></div>
      
      </div>
    )



}


export {Showtimes}


