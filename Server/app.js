require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const PORT = 3000;

const app = express();
connectDB();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads' , express.static('uploads'));



// using user router
app.use('/', require('./Routes/user'))
// using admin router 
app.use('/' , require('./Routes/admin'))





app.listen(PORT, () => {
  console.log(`our app is listening on port : ${PORT}`);
});
