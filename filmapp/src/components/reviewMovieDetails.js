import axios from 'axios'
import { useUser } from '../context/useUser.js'

const base_url = 'http://localhost:3001/review'


const getMovieByName =async (token, movie) => {
    try{
        console.log("getMovieByName: before response")
        const response = await axios.get(base_url + "/moviebyname", {
            //headers:{Authorization: 'Bearer ' + token},
            params:{moviename: movie}
        })
        //const data = await response.json()
        console.log("getMovieByName: after response")
        console.log("getmoviebyname-typeof:response: ", typeof response)
        console.log("data: ", response)
        //return response.data
        return response.data
    }catch(error){
        console.error("getMovieByName-virhe: ",error)

    }
    


}

const getMovieDetails = async(token, id) => {
    try{
        let response = await axios.get(base_url + "/moviedesc/"+id, {
                headers:{Authorization: 'Bearer '+ token},
                params:{id: id}
        })
        return response.data
    }catch(error){
        console.error(error)
    }
    

}

const getCredits = async(token ,id) => {
    try{    
        let response = await axios.get(base_url + "/moviecreds/" +id, {
            headers:{Authorization: 'Bearer '+token},
            params: {id: id}
        })
        return response.data
        
    }catch(error){
        console.error(error)
    }
}

export {getMovieDetails, getCredits}