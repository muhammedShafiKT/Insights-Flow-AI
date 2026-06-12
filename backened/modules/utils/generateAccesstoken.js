import jwt from "jsonwebtoken"
const generateAccesstoken = (user)=>{
    return jwt.sign({
        userId : user._id,
        role : user.role
    },
    process.env.JWT_ACCESS_SECRET,
    {
        expiresIn :"15m"
    }

)
}
export default generateAccesstoken