import axios from 'axios'

const base_url = 'http://localhost:3001/review'

    /*const axiosEmail = async (token, idUser) => {
        try {
          let response = await axios.get(base_url + "/email/" + idUser , {
            headers : {
                Authorization: 'Bearer '+ token
            }
                      
          });
          return response.data
        } catch (error) {
          console.error(error);
        }
      };*/

      const axiosUserReview = async(token, idMovie) => {
        try{
            let response = await axios.get(base_url + "/user/" + idMovie +"/", {
                headers:{
                    Authorization: 'Bearer '+ token
                }
            });
            return response.data
        }catch(error){
            console.error(error);
        }
      }

      const axiosPostReview = async(token, idMovie, moviename, stars, comment) => {
        try{
            let response = await axios.post(base_url + "/post", {
                headers: {Authorization: 'Bearer '+token},
                idMovie: idMovie,
                moviename:moviename,
                stars: stars,
                comment: comment
            })
            return response.data
        }catch(error){
            console.error(error)
        }
      }

      const axiosDeleteReview = async(token, idMovie) => {
        try{
            let response = await axios.delete(base_url + '/delete/'+idMovie+"/", {
                headers: {Authorization: 'Bearer '+token}
            })
            return response.data
        }catch(error){
            console.error(error)
        }
      }

      const axiosPatchReview = async(token, idMovie, moviename, stars, comment) => {
        try{
            let response = await axios.patch(base_url + '/update', {
                headers: {Authorization: 'Bearer '+token},
                idMovie: idMovie,
                moviename:moviename,
                stars: stars,
                comment: comment
            })
            return response.data
        }catch(error){
            console.error(error)
        }
      }

      const axiosGetReviews = async(token, idMovie) => {
        try{
            let response = await axios.get(base_url + '/all/'+idMovie, {
                headers: {Authorization: 'Bearer '+token}
            })
            //console.log(response.data)
            return response.data
        }catch(error){
            console.error(error)
        }
      }

      const axiosGetStars = async(idMovie) => {
        try{
            let response = await axios.get(base_url + '/stars/'+idMovie)
            //console.log("axiosGetStars")
            //console.log(response.data)
            return response.data
        }catch(error){
            console.error(error)
        }
      }

      const axiosNewReview = async(token, idMovie, moviename, stars, comment) => {
        try{
            let response = await axios.post(base_url + '/new', {
                idMovie: idMovie,
                moviename:moviename,
                stars: stars,
                comment: comment
            },{
                headers: {Authorization: 'Bearer '+token}
            
            })
            return response.data
        }catch(error){
            console.error(error)
        }
      }
      
      /*const axiosCheckUser = async(token, id) => {
        let response = await axios.get(base_url + '/checkuser', {
            headers:{
                Authorization: 'Bearer '+ token
            },
            params: {userID: id}
        })
        return response.data
      }*/

      
    
      export {axiosUserReview, axiosPostReview ,axiosDeleteReview, axiosPatchReview, axiosGetReviews, axiosGetStars, axiosNewReview}

