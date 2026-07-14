import express from "express"
import {register,login, verifyotp,getme, refreshaccess, logout, forgotpassword, resetpassword, googleCallback, updateName} from './auth.controller.js'
import veriftoken from '../../middlewares/verifytoken.js'
import passport from "../../config/passport.js"
const router = express.Router()
router.post("/register",register)
router.post("/login",login)
router.post("/verify-otp",verifyotp)
router.get("/getme",veriftoken,getme)
router.post("/refresh",refreshaccess)
router.post("/logout",logout)
router.post("/forgot-password",forgotpassword)
router.post("/reset-password",resetpassword)
router.patch("/update-name", veriftoken, updateName)

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false
}))

router.get("/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`
}), googleCallback)


export default router