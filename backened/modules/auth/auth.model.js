

import { boolean } from "drizzle-orm/gel-core";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name :{ type :String,required :true,trim : true},
    email :{type :String,required :true,trim : true , unique:true , lowercase :true},
    password :{type :String,required :true},
    role :{type :String , enum :["user","admin"],default:"user"},
    isBlocked :{type:boolean,default:false},
    otp:{type : String , default :null  },
    refreshToken :{type:String,default:null},
    isVerified:{type : Boolean,default :false},
    otpExpiry :{type:Date,default:null}
},{
    timestamps:true
})
const User = mongoose.model("User",userSchema)
export default User