const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//secret key
const SECRET_KEY = process.env.SECRET_KEY

/////////////////////////////////////////
/////register new user (for admins)//////
////////////////////////////////////////

exports.registerUser = async (req,res) =>{
    try {
        const {username, password, role} = req.body

        //check if the user exists
        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({message : "user already exists "})
        }
        const hashedPass = await bcrypt.hash(password,10)

        //create new user
        const newUser = new User({
            username, password : hashedPass, role
        })
        await newUser.save()
        return res.status(201).json({message : "user registred sucessfully "})

    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}

/////////////////////////////////////////
/////login user /////////////////////////
////////////////////////////////////////

exports.loginUser = async (req,res) =>{
    try {
        const {username, password} = req.body

        //check for the username
        const user = await User.findOne({username})
        if(!user){
            return res.status(400).json({ message: 'not registred, register NOW !' });
        }
        //compare the passwords
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    
        //generate JWT token for 2h of session
        const token = jwt.sign(
            {userID : user._id, username : user.username, role : user.role},
            SECRET_KEY,
            {expiresIn : '2H'}
        )
        res.json({token, username: user.username, role : user.role})  
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}

/////////////////////////////////////////
/////get user profile////////////////////
////////////////////////////////////////

exports.getUserProfile = async (req,res) =>{
    try {
        const user = await User.findById(req.user.userID)
        if(!user){
            return res.status(404).json({message : "no user found ! "})
        }
        res.json(user)
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}