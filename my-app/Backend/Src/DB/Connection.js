import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv"
dotenv.config();

const dbConnect = async ()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.Mongo_Url}dbName=${DB_NAME}`)
        console.log(`\n Mongo Db Connected At Host: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log(`Error Connecting DataBase : `,error)
    }
}

export default dbConnect;