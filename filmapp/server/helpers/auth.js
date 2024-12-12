import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

const { verify, sign } = jwt
const authorizationRequired = "Authorization required"
const invalidCredentials = "Invalid credentials"

const auth = (req,res,next) => {
    if (!req.headers.authorization) {
        res.statusMessage = authorizationRequired
        res.status(401).json({message: authorizationRequired})
    } else {
        try {
            //const authHeader = req.headers.authorization
            //const token = authHeader.split(" ")[1]
            const authHeader = req.headers.authorization
            const token = authHeader.split(' ')[1]
            console.log('token in auth: '+token)
            const decodedUser = verify(token,process.env.JWT_SECRET_KEY)
            //console.log(decodedUser)
            console.log("User: ",decodedUser.username)
            console.log("UserID: ", decodedUser.id)
            const new_token = sign({username: decodedUser.username, id: decodedUser.id},process.env.JWT_SECRET_KEY,{expiresIn: '3m'})
            next()
            return res
                .header('Access-Control-Expose-Headers','Authorization')
                .header('Authorization','Bearer ' + token) 
            //console.log("hoi"+decodedUser)
            //jwt.verify(token,process.env.JWT_SECRET_KEY)
            //const new_token = sign({username: decodedUser.username},process.env.JWT_SECRET_KEY,{expiresIn: '1m'})
            //res.header('Access-Control-Expose-Headers','Authorization')
            //res.header('Authorization','Bearer ' + new_token)
            
        } catch (err) {
            res.statusMessage = invalidCredentials
            res.status(403).json({message: invalidCredentials})
        }
    }
}

export { auth }