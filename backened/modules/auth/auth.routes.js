import express from "express"
import {register,login, verifyotp,getme, refreshaccess, logout, forgotpassword, resetpassword} from './auth.controller.js'
import veriftoken from '../../middlewares/verifytoken.js'
const router = express.Router()
router.post("/register",register)
router.post("/login",login)
router.post("/verify-otp",verifyotp)
router.get("/getme",veriftoken,getme)
router.post("/refresh",refreshaccess)
router.post("/logout",logout)
router.post("/forgot-password",forgotpassword)
router.post("/reset-password",resetpassword)

export default router