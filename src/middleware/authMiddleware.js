//this middleware to check the validity of the token

const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

exports.authMiddleware = (req ,res,next) =>{
    const token = req.header("Authorization") //usually where the client (navigator) puts the token

    if(!token){
        return res.status(401).json({message : "no token, acces denied ! "})
    }
    // verifying if the generated token of login = token on the request header
    try {
        const decodedUser = jwt.verify(token, SECRET_KEY)
        req.user = decodedUser
        next()
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
} 