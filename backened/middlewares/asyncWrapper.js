export const asyncWrapper = (fn)=>{
    return async (req,res,next)=>{
        try {
           await fn(req,res,next) 
        } catch (error) {
            res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
         } )
        
        }
    }
}