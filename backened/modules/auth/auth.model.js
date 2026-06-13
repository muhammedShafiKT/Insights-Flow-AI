


import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name :{ type :String,required :true,trim : true},
    email :{type :String,required :true,trim : true , unique:true , lowercase :true},
    password :{type :String,required :false},
    role :{type :String , enum :["user","admin"],default:"user"},
    isBlocked :{type:Boolean,default:false},
    otp:{type : String , default :null  },
    refreshToken :{type:String,default:null},
    isVerified:{type : Boolean,default :false},
    otpExpiry :{type:Date,default:null},
    googleId :{type:String,default:null,unique:true,sparse:true},
    authProvider :{type:String,enum:["local","google"],default:"local"}
},{
    timestamps:true
})
const User = mongoose.model("User",userSchema)
export default User