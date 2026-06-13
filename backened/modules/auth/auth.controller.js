import  authService  from "./auth.service.js"
export const register = async(req,res)=>{
    try {
        const result = await authService.register(req,res)
       return res.status(201).json(result)
    } catch (error) {
        return res.status(error.statusCode||500).json({message : error.message})
    }
}

export const login = async(req,res)=>{
    try {
        const result = await authService.login(req,res)
       return res.status(200).json(result)
    } catch (error) {
        return res.status(error.statusCode||500).json({message : error.message})
    }
}

    export const verifyotp = async(req,res)=>{
    try {
        const result = await authService.verifyotp(req,res)
       return res.status(200).json(result)
    } catch (error) {
        return res.status(error.statusCode||500).json({message : error.message})
    }
    }

    

    export const refreshaccess = async(req,res)=>{
    try {
        const result = await authService.refreshlogin(req,res)
       return res.status(200).json(result)
    } catch (error) {
        return res.status(error.statusCode||500).json({message : error.message})
    }
    }
    
    export const getme = async(req,res)=>{
    try {
        const result = await authService.getme(req,res)
       return res.status(200).json(result)
    } catch (error) {
        return res.status(error.statusCode||500).json({message : error.message})
    }
    }

        export const logout = async(req,res)=>{
    try {
        const result = await authService.logout(req,res)
       return res.status(200).json(result)
    } catch (error) {
        return res.status(error.statusCode||500).json({message : error.message})
    }
    }

            export const forgotpassword = async(req,res)=>{
    try {
        const result = await authService.forgotpassword(req,res)
       return res.status(200).json(result)
    } catch (error) {
        return res.status(error.statusCode||500).json({message : error.message})
    }
    }

            export const resetpassword = async(req,res)=>{
    try {
        const result = await authService.resetpassword(req,res)
       return res.status(200).json(result)
    } catch (error) {
        return res.status(error.statusCode||500).json({message : error.message})
    }
    }

    export const googleCallback = async (req, res) => {
    try {
        const result = await authService.googleLogin(req, res)
        res.redirect(`${process.env.CLIENT_URL}/home`)
    } catch (error) {
        res.redirect(`${process.env.CLIENT_URL}/login`)
    }
}
