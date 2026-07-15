import User from "./auth.model.js"
import generateOtp from "../utils/generateOtp.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import generateAccesstoken from "../utils/generateAccesstoken.js"
import generateRefreshtoken from "../utils/generateRefreshtoken.js"
import sendEmail from "../utils/sendEmail.js"

const createError = (message, statusCode) => {
    const error = new Error(message)
    error.statusCode = statusCode
    return error
}

const authService = {
    register: async (req, res) => {
        const { name, email, password } = req.body

        const existinguser = await User.findOne({ email })
        if (existinguser) {
            throw createError("User already exists, try login", 400)
        }

        const hashedpassword = await bcrypt.hash(password, 10)
        const otp = generateOtp()
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

        const createuser = await User.create({
            name,
            email,
            password: hashedpassword,
            otp,
            otpExpiry
        })

        await sendEmail(
            email,
            "Verify your InsightFlow account",
            `<h2>Welcome to InsightFlow, ${name}!</h2>
             <p>Your verification OTP is:</p>
             <h1 style="letter-spacing:4px;">${otp}</h1>
             <p>This OTP expires in 10 minutes.</p>`
        )

        return {
            message: "Registration successful. Check your email for OTP",
            user: {
                _id: createuser._id,
                name: createuser.name,
                email: createuser.email,
                role: createuser.role,
            }
        }
    },

    login: async (req, res) => {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            throw createError("User not found, try register", 404)
        }
        if(user.isBlocked){
            throw createError("Blocked User !",403)
        }
        const passwordchecking = await bcrypt.compare(password, user.password)
        if (!passwordchecking) {
            throw createError("Incorrect password", 401)
        }
        if (!user.isVerified) {
            throw createError("Please verify your email before logging in", 403)
        }

        const refreshtoken = generateRefreshtoken(user)
        const accesstoken = generateAccesstoken(user)

        user.refreshToken = refreshtoken
        await user.save()

        res.cookie("accesstoken", accesstoken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
              secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return {
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }
    },

    verifyotp: async (req, res) => {
        const { email, otp } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            throw createError("User not found", 404)
        }

        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            throw createError("OTP expired", 400)
        }

        if (otp != user.otp) {
            throw createError("Incorrect OTP", 400)
        }

        user.otp = null
        user.otpExpiry = null
        user.isVerified = true

        const accesstoken = generateAccesstoken(user)
        const refreshtoken = generateRefreshtoken(user)
        user.refreshToken = refreshtoken
        await user.save()

        res.cookie("accesstoken", accesstoken, {
            httpOnly: true,
             secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        })
        res.cookie("refreshtoken", refreshtoken, {
            httpOnly: true,
             secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return {
            message: "Verification successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }
    },

    refreshlogin: async (req, res) => {
        const refreshToken = req.cookies.refreshtoken
        if (!refreshToken) {
            throw createError("Refresh token required", 401)
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user = await User.findById(decoded.userId)
        if (!user) {
            throw createError("User not found", 404)
        }

        if (refreshToken !== user.refreshToken) {
            throw createError("Invalid refresh token", 401)
        }

        const accesstoken = generateAccesstoken(user)
        res.cookie("accesstoken", accesstoken, {
            httpOnly: true,
             secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        })

        return { message: "Access token refreshed" }
    },

    getme: async (req, res) => {
        const user = await User.findById(req.user.userId).select("-password -otp -refreshToken")
        if (!user) {
            throw createError("User not found", 404)
        }
        return { user }
    },

    updateName: async (req, res) => {
        const { name } = req.body

        if (!name || !name.trim()) {
            throw createError("Name is required", 400)
        }

        const user = await User.findById(req.user.userId)
        if (!user) {
            throw createError("User not found", 404)
        }

        user.name = name.trim()
        await user.save()

        return {
            message: "Name updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        }
    },

    logout: async (req, res) => {
        const refreshtoken = req.cookies.refreshtoken
        if (!refreshtoken) {
            throw createError("Already logged out", 400)
        }

        const user = await User.findOne({ refreshToken: refreshtoken })
        if (user) {
            user.refreshToken = null
            await user.save()
        }

        res.clearCookie("accesstoken", {
            httpOnly: true,
             secure: true,
            sameSite: "none",
        })
        res.clearCookie("refreshtoken", {
            httpOnly: true,
             secure: true,
            sameSite: "none",
        })

        return { message: "Logout successful" }
    },

    forgotpassword: async (req, res) => {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            throw createError("User not found", 404)
        }

        const otp = generateOtp()
        user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
        user.otp = otp
        await user.save()

        await sendEmail(
            email,
            "InsightFlow Password Reset OTP",
            `<h2>Password Reset Request</h2>
             <p>Your OTP to reset your password is:</p>
             <h1 style="letter-spacing:4px;">${otp}</h1>
             <p>This OTP expires in 10 minutes.</p>`
        )

        return { message: "Reset OTP sent to your email" }
    },

    resetpassword: async (req, res) => {
        const { email, otp, newPassword } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            throw createError("User not found", 404)
        }
        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            throw createError("otp expired", 400)
        }
        if (otp !== user.otp) {
            throw createError("Invalid OTP", 400)
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedpassword
        user.otp = null
        user.otpExpiry = null
        await user.save()

        return { message: "Password reset successful" }
    },
    googleLogin: async (req, res) => {
    const user = req.user // set by passport

    const refreshtoken = generateRefreshtoken(user)
    const accesstoken = generateAccesstoken(user)

    user.refreshToken = refreshtoken
    await user.save()

    res.cookie("accesstoken", accesstoken, {
        httpOnly: true,
         secure: true,
            sameSite: "none",
        maxAge: 15 * 60 * 1000
    })
    res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
         secure: true,
            sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return { message: "Google login successful" }
}
}

export default authService