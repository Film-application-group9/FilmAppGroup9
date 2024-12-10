import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { xmlToJson } from './xmlToJSON.js'
import { AreaList, PVM, AreaID, AlueBool } from './params.js'
import { JSONtoList } from './JSONtoList.js'
import "./showtime.css"
import {axiosUserGroups, axiosMovieToGrou, axiosShowtimeToGroup} from "../components/groupFunctions.js"
import { timeHandle } from './timeHandle.js'

const Showtimes = ({loggedIn, token, userId}) =>{
    const [json, setJson] = useState(null)
    const [error, setError] = useState(null)
    const [dt, setDt]=useState(null)
    const [areaID, setAreaID]=useState(1029)

    const arealist = AreaList()
    const dateList = PVM()

    const [alueBool, setAlueBool]=useState(true)

    const [groupInfo, setGroupInfo] = useState(null)
    const [groupArray, setGroupArray] = useState(null)

    const [areaSelected, setAreaSelected] = useState(null)

    const [showtime, setShowtime] = useState(null)
    const [movieTitle, setMovieTitle] = useState(null)
    const [movieOriginalTitle, setMovieOriginalTitle] = useState(null)
    const [moviePlace, setMoviePlace] = useState(null)
    
    //const[selectedGroupValue, setSelectedGroupValue] = useState(null)


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
      setAreaSelected(area)
      
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
              <td>{loggedIn == true ? <button onClick={() => clickGroup(elokuva.Time, elokuva.Title,elokuva.OriginalTitle, elokuva.Place)}>Add to Group</button>:""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  }

  const clickGroup = async (time, title, originalTitle, place) => {
    try{
      
      setMovieTitle(title)
      setMovieOriginalTitle(originalTitle)
      if(place == null){
        place = areaSelected
      }
      setMoviePlace(place)
      const groups = await axiosUserGroups(token, userId)
      const timestamp = timeHandle (time, dt)
      setShowtime(timestamp)
      if(groups.length == 0){
        setGroupInfo("User has no groups")
        setGroupArray([])

      }else if(groups.length == 1){
        
        
        
        
        
        
        //const postShowtimeToGroup = await axiosShowtimeToGroup(token, groups[0].id_group, timestamp,place, originalTitle, title, userId )
        const postShowtimeToGroup = await showtimeToGroup(groups[0].id_group, groups[0].groupname)
        setGroupArray([])
        setGroupInfo("User has one group, showtime posted to group "+groups[0].id_group)
        //console.log("clickGroup-groups: ", groups)
      }else{
        setGroupInfo("User has multiple group, choose group: ")
        const grArr = groups.map(g => ({
          id: g.id_group,
          name: g.groupname
      }))
        setGroupArray(grArr)
      }
    }catch(error){
      console.error(error)
    }
    
  }

  const GroupInformation = () => {
    const [selectedValue, setSelectedValue] = useState(null)
    //const [id, setId] = useState(null)

    if(groupArray == null || groupArray.length == 0 || groupArray.length == 1){
      return(<div><p>{groupInfo}</p></div>)
    }else{
      return(<div  id="GroupView"><h2>Choose group: </h2>
        <div  id="GroupList">
        <select value={selectedValue}>
        {groupArray.map(ga => (
        <option value={ga.id}>{ga.name}</option>
      ))}</select></div><br/>
      <button onClick={() => showtimeToGroup(selectedValue)}>Add to Group</button><br></br>
      <button onClick={() => cancelChoose()}>Cancel add</button>
      </div>)

  }}

  const showtimeToGroup = async (groupID) => {
    const postShowtimeToGroup = await axiosShowtimeToGroup(token, groupID, showtime,moviePlace, movieOriginalTitle, movieTitle, userId )
    setGroupInfo("The showtime has been posted in the group")
    setGroupArray(null)
  }

  const cancelChoose = () => {
    setGroupInfo("The add was canceled")
    setGroupArray(null)
  }

    return(
      <div>
        <GroupInformation/>
        <select id="date" onChange={DateMuutos}>
            <option value={""}>Tänään</option> {}
            {dateList.map((option, index) => (
            <option key={index} value={option}>
            {option}
          </option>
        ))}
            </select>
            <select id="area" value={areaSelected} onChange={AreaMuutos}>
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


