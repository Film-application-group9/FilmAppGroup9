import axios from "axios"

const base_url = 'http://localhost:3001/groups'

const axiosUserGroups = async (token, idUser) => {
    try {
        let response = await axios.get(base_url + '/mygroups/' + idUser, {
            headers: { authorization: token }
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

const axiosMovieToGroup = async (token, idGroup, idMovie, idUser, moviename, moviename_orig, imgPath) => {
    try {
        const response = await axios.post(base_url + '/' + idGroup + '/addMovie', {
            movieId: idMovie,
            userId: idUser,
            moviename: moviename,
            movienameORIG: moviename_orig,
            imgPath: imgPath
        },
        {
            headers: { authorization: token }
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

const axiosShowtimeToGroup = async (token, idGroup, showtime, place, original_moviename, finnish_moviename, idUser) => {
    console.log("axiosShowtimeToGroup-showtime", showtime)
    console.log("axiosShowtimeToGroup-place", place)
    console.log("axiosShowtimeToGroup-idUser", idUser)
    console.log("axiosShowtimeToGroup-moviename_original", original_moviename)
    console.log("axiosShowtimeToGroup-moviename_finnish", finnish_moviename)
    console.log("axiosShowtimeToGroup-idGroup: ", idGroup)
    try {

        const response = await axios.post(base_url + '/' + idGroup + '/addshowtime', {
            showtime: showtime,
            place: place,
            userId: idUser,
            movienameORIG: original_moviename,
            movienameFI: finnish_moviename
        },
            {
                headers: { authorization: token }
            })
        return response.data
    } catch (error) {
        console.error(error)
    }
}
export { axiosUserGroups, axiosMovieToGroup, axiosShowtimeToGroup }