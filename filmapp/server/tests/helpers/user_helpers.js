//test_db tehty
//rekisteröinti
//loginit
//postaukset
//viimeinen katsoo onko reviewit oikein

import axios from "axios"

const base_url = 'http://localhost:3001'

const testRegister = async (username, password) => {
        const response = await axios.post(base_url + '/user/register', {
            username: username,
            password: password
        }
    )
    return response.data
}



const testLogin = async (username, password) => {
   const response =  await axios.post(base_url + '/user/login', {
        username: username,
        password: password
    })
    return response.data
}

const testNew = async(token, idMovie, moviename, stars, comment) => {
    const response = await axios.post(base_url + '/new', {
        idMovie: idMovie,
        moviename: moviename,
        stars: stars,
        comment: comment,
    },{
        headers: {Authorization: 'Bearer '+token}
    })
    return response.data
}

export {testLogin, testNew, testRegister}