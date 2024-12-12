import { jwtDecode } from 'jwt-decode'

const decodeTokenUser = (token) => {
    try{
        const decode = jwtDecode(token)
        console.log("DECODE: ",decode)
        return decode
    }catch(error){
        console.log(error)
    }
    
}

export default decodeTokenUser