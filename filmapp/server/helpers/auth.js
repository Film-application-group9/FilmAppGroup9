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
            const token = req.headers.authorization
            const decodedUser = verify(token,process.env.JWT_SECRET_KEY)
            const new_token = sign({username: decodedUser.username, id: decodedUser.id},process.env.JWT_SECRET_KEY,{expiresIn: '15m'})
            
            res
                .header('Access-Control-Expose-Headers','Authorization')
                .header('Authorization','Bearer ' + new_token)
            next()
            
        } catch (err) {
            res.statusMessage = invalidCredentials
            res.status(403).json({message: invalidCredentials})
        }
    }
}

export { auth }