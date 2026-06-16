import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/user/auth/Login'
import Home from '../pages/user/components/Home'
import Register from '../pages/user/auth/Register'
import ForgotPassword from '../pages/user/auth/Forgotpassword'
import VerifyOtp from '../pages/user/auth/VerifyOtp'
import DatasetUpload from '../pages/user/datasets/DatasetUpload'

function Approutes() {
  return (
   <Routes>
   <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path='/login' Component={Login}/>
    <Route path='/home' Component={Home} />
    <Route path='/register' Component={Register} />
    <Route path='/forgot-password' Component={ForgotPassword} />
    <Route path='/verify-otp' Component={VerifyOtp} />
    <Route path='/datasets' Component={DatasetUpload} />
   </Routes>
  )
}

export default Approutes