import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
async function databaseconnecting() {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Mongodb connected")
    } catch (error) {
        console.log("databse connection failed",error.message)
    }
}
 export default databaseconnecting()