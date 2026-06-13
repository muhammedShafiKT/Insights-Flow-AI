import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()
import databaseconnecting from "./config/db.js"
import authRoutes from "./modules/auth/auth.routes.js"
import passport from "./config/passport.js"


const app = express()
app.use(cookieParser())
app.use(cors({ origin: process.env.CLIENT_URL ,
    credentials :true
}
))
app.use(passport.initialize())
app.use(express.json())

app.use("/api/auth",authRoutes)

app.listen(process.env.PORT ||3000,()=>{
    console.log("server running")
})