import jwt from "jsonwebtoken";

const verifytoken=(req,res,next)=>{
    const token=req.cookies.accesstoken
    if(!token){
        return res.status(401).json({message :"unauthorized"})
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        req.user=decoded
        next()
    } catch (error) {
        return res.status(401).json({message:"Invalid token"})
    }
}
export default verifytoken