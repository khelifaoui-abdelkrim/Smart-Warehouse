const express = require('express');

const {registerUser, loginUser, getUserProfile,getAllUsers,updateUser,deleteUser} = require("../controllers/usercontroller")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/register",authMiddleware, registerUser); //register user
router.post("/login", loginUser); //login user
router.get("/all",authMiddleware, getAllUsers); //get all users 
router.get("/:identifier",authMiddleware, getUserProfile); //get user
router.put("/update/:oldUsername",authMiddleware, updateUser); //update user
router.delete("/delete/:username",authMiddleware, deleteUser); //delete user


module.exports = router