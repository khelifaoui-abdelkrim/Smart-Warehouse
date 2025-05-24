const express = require('express');

const {setPaletteModel, getPaletteModel,getAllModels} = require("../controllers/pallet_modelController")
const {authMiddleware} = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/model",setPaletteModel); //set pallete model
router.get("/model/:line",getPaletteModel); //get pallete model
router.get("/all",getAllModels); //get pallete model


module.exports = router