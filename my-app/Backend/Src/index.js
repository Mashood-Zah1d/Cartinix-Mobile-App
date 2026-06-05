import app from "./app.js";
import dbConnect from "./db/Connection.js";
import dotenv from 'dotenv'
dotenv.config({path:'./env'})


dbConnect()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=> {
      console.log(`Server Is Running On Port : ${process.env.PORT}`);
    })
})
.catch(err=>{
    console.log(`Mongo DB Error Failed:`,err);
})