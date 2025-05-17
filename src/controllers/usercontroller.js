const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//secret key
const SECRET_KEY = process.env.SECRET_KEY

/////////////////////////////////////////
/////register new user (for admins)//////
////////////////////////////////////////

exports.registerUser = async (req,res) =>{
    try {
        const {username, password, role,email,phone,name, lastname,validated} = req.body

        //check if the user exists
        const existingUser = await User.findOne({username})
        if(existingUser){
            return res.status(400).json({message : "user already exists "})
        }
        const hashedPass = await bcrypt.hash(password,10)

        //create new user
        const newUser = new User({
            username, 
            password : hashedPass, 
            role,
            email,
            phone,
            name,
            lastname,
            validated
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
        const {username,email, password} = req.body

        //check for the username
        const user = await User.findOne({
            $or: [{email},{username}]
        })
        if(!user){
            return res.status(400).json({ message: 'not registred !' });
        }
        //compare the passwords
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid password' });
        }
    
        //generate JWT token for 8h of session
        const token = jwt.sign(
            {userID : user._id, username : user.username, email : user.email, role : user.role},
            SECRET_KEY,
            {expiresIn : '8H'}
        )
        res.status(200).json({token, username: user.username, role : user.role})  
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}

/////////////////////////////////////////
/////get users////////////////////
////////////////////////////////////////

exports.getAllUsers = async (req,res) =>{
    try {
        const user = await User.find({})
        if(!user){
            return res.status(404).json({message : "no users found ! "})
        }
        res.json(user)
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}

/////////////////////////////////////////
/////get a single user////////////////////
////////////////////////////////////////

exports.getUserProfile = async (req,res) =>{
    const {username} = req.params;
    try {
        const user = await User.find({username})
        if(!user){
            return res.status(404).json({message : "user not found ! "})
        }
        res.json(user)
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}

/////////////////////////////////////////
/////update user////////////////////
////////////////////////////////////////

exports.updateUser = async (req,res) =>{
    const {username, password, role,email,phone,name, lastname,validated} = req.params;
    try {
        const user = await User.find({username})
        if(!user){
            return res.status(404).json({message : "user not found ! "})
        }

        user.username = username;
        user.password = password;
        user.role = role;
        user.email = email;
        user.phone = phone;
        user.name = name;
        user.lastname = lastname;
        user.validated = validated;

        await user.save();

        res.json(user)
    } catch (err) {
        return res.status(500).json({message : "server error : ",err})
    }
}