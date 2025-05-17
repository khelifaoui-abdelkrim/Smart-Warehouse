const express = require('express');

const {registerUser, loginUser, getUserProfile,getAllUsers,updateUser} = require("../controllers/usercontroller")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/register",authMiddleware,registerUser); //register user
router.post("/login",loginUser); //login user
router.get("/all",getAllUsers); //get all users 
router.get("/:username",getUserProfile); //get user
router.put("/update",updateUser); //get user


module.exports = router