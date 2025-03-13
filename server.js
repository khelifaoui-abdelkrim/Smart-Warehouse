require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const pallet_routes = require('./routes/paletteRoutes');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
        console.log("MongoDB connected ✅")
    }
    catch(error){
        console.log("error occured ❌ :",error.message)
        process.exit(1)
    }
}
connectDB();

app.use('/pallets',pallet_routes); //  this means use all paletteRoutes.js with the prefix /pallets ex: /pallets/add

// Test route
app.get('/', (req, res) => {
    res.send("Smart Pallet System API is running...");
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
