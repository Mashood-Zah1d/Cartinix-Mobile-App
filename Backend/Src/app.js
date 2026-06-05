import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
const app = express();
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(cors({
    origin:process.env.Origin,
    credentials:true
}))

import userRoutes from './routes/User.Routes.js'

app.use("/api/v1/users",userRoutes);

import productRoutes from './routes/Product.Routes.js'

app.use("/api/v1/products",productRoutes);

import chatbotRoutes from './Routes/Chatbot.Routes.js'

app.use("/api/v1/chatbot",chatbotRoutes)

export default app;