const mongoose = require('mongoose');

// dotenv==>variable use here

require('dotenv').config();


function connectDB() {

    // database connection
    // url ==>me live mongodb ka live or url aae ga
    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGO_CONNECT_URL,
        //  { useNewUrlParser:true , useCreateIndex:true , useUnifiedTopology:true ,useFindAndModify : true } 
    );

    const connection = mongoose.connection;

    // once==>like eventlistener==>connectbase it call it use on instead of catch err
    // connection.once('open', () =>{
    //     console.log("Database connected");
    // }).catch(err => {
    //          console.log("Connection Failed");
    //      })

    connection.once('open',  ()=> {
            console.log("Database connected");
        })
        .on('error',  (err) => {
            console.log(err);
            console.log("Connection Failed");
        });


    // .catch((err)=>{
    //         console.log("Connection Failed");
    // })


}

module.exports = connectDB;





