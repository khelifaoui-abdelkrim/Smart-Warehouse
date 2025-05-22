const express = require('express');

const {registerUser, loginUser, getUserProfile,getAllUsers,updateUser,deleteUser} = require("../controllers/usercontroller")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/register",registerUser); //register user
router.post("/login",loginUser); //login user
router.get("/all",getAllUsers); //get all users 
router.get("/:username",getUserProfile); //get user
router.put("/update/:oldUsername",updateUser); //update user
router.delete("/delete/:username",deleteUser); //delete user


module.exports = router