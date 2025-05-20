const express = require('express');
const {authMiddleware} = require('../middleware/authMiddleware')
const {createOrder,getAllPending,getAllShipped} = require('../controllers/orderController')
const router = express.Router();


//create an order ✅
router.post("/create",createOrder);

//get all pending orders ✅
router.get("/all",getAllPending);

//get all shipped orders ✅
router.get("/all",getAllShipped);

module.exports = router;