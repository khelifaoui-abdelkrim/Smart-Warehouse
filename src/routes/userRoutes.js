const express = require('express');

const {registerUser, loginUser, getUserProfile} = require("../controllers/usercontroller")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/register",authMiddleware,registerUser); //register user
router.post("/login",loginUser); //login user
router.get("/profile",getUserProfile); //test the token validity, then get user profile

module.exports = router