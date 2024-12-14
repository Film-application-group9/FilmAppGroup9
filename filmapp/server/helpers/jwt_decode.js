import { jwtDecode } from 'jwt-decode'

const decodeTokenUser = (token) => {
    try{
        const decode = jwtDecode(token)
        return decode
    }catch(error){
        console.log(error)
    }
    
}

export default decodeTokenUser