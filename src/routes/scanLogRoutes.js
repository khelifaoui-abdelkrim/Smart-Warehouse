const express = require('express');

const {scanLog} = require("../controllers/scanLogController")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/scan",authMiddleware,scanLog)

module.exports = router