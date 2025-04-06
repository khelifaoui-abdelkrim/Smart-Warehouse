const express = require('express');

const {scanLog,getScanLog} = require("../controllers/scanLogController")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/scan",authMiddleware,scanLog)
router.get("/scan/history",authMiddleware,getScanLog)


module.exports = router