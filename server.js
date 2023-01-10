const express = require('express');

const app = express();

// iska matlab hai ke agar serve ho tou wo chalyga wrna default 5000 pr
const PORT =process.env.PORT || 5000


// importing database page here to run

const connectDB = require('./config/db');

connectDB();

// Routes 
app.use('/api/files', require('./routes/files'));

app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`);
})