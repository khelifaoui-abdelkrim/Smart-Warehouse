const express = require('express');

const {setPaletteModel, getPaletteModel} = require("../controllers/pallet_modelController")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/model",setPaletteModel); //set pallete model
router.get("/model",getPaletteModel); //get pallete model

module.exports = router