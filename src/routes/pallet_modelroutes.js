const express = require('express');

const {setPaletteModel, getPaletteModel,getAllModels} = require("../controllers/pallet_modelController")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/model",setPaletteModel); //set pallete model
router.get("/model/:line",getPaletteModel); //get line pallete model
router.get("/all",getAllModels); //get all lines palette model


module.exports = router