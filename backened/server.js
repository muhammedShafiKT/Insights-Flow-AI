import express from "express"
import http from "http"
import { initsocket } from "./config/socket.js"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { validateEnv } from "./config/validateEnv.js"
dotenv.config()
validateEnv()
import databaseconnecting from "./config/db.js"
import authRoutes from "./modules/auth/auth.routes.js"
import passport from "./config/passport.js"
import datasetRoutes from "./modules/datasets/dataset.routes.js"
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js"
import ConversationalRoutes from "./modules/conversation/conversation.routes.js"
import { redis, redisConnect } from "./config/redis.js"
// import { datasetQueue } from "./bullmq/queue.js"

await redisConnect()
const app = express()
app.use(cookieParser())
app.use(cors({ origin: process.env.CLIENT_URL ,
    credentials :true
}
))
app.use(passport.initialize())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/datasets",datasetRoutes)
app.use("/api/datasets",dashboardRoutes)
app.use("/api/datasets",ConversationalRoutes)

app.get("/redis-test",async(req,res)=>{
    await redis.set("name","Shafiiii")
    const value = await redis.get("name")
    res.json({
        success : true,
        value
    })
})

// app.get("/queue-test",async(req,res)=>{
//     const job = await datasetQueue.add("test-job",{
//         message : "hello bullmq"
//     })
//     res.json(job)
// })
const httpServer = http.createServer(app)
await initsocket(httpServer)
httpServer.listen(process.env.PORT ||3000,()=>{
    
    console.log("server running")
})