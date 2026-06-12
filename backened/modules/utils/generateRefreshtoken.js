import jwt from "jsonwebtoken"
const generateRefreshtoken = (user)=>{
    return jwt.sign({
        userId : user._id,
        role : user.role
    },
    process.env.JWT_REFRESH_SECRET,
    {
        expiresIn :"7d"
    }

)
}
export default generateRefreshtoken