import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/user/auth/Login.jsx'
import Home from '../pages/user/components/Home.jsx'
import Register from '../pages/user/auth/Register.jsx'
import ForgotPassword from '../pages/user/auth/Forgotpassword.jsx'
import VerifyOtp from '../pages/user/auth/VerifyOtp.jsx'

import DatasetWorkspace from '../pages/user/datasets/Datasetworkspace.jsx'
import AppLayout from '../pages/user/Layout/Applayout.jsx'
import Dashboard from '../pages/user/dashboard/dashboard.jsx'
import ChartSelectorPage from '../pages/user/dashboard/Chartselectorpage.jsx'
import ChatPage from '../pages/user/datasets/Chatpage.jsx'
import Profile from '../pages/user/auth/Profile.jsx'

function Approutes() {
  return (
   <Routes>
   <Route path="/" element={<Navigate to="/home" replace />} />
    <Route path='/login' Component={Login}/>
    <Route path='/home' Component={Home} />
    <Route path='/register' Component={Register} />
    <Route path='/forgot-password' Component={ForgotPassword} />
    <Route path='/verify-otp' Component={VerifyOtp} />
    <Route path="/profile" Component={Profile}/>
    
    
      <Route
        path='/datasets'
        element={
          <AppLayout pageTitle="Workspace">
            <DatasetWorkspace />
          </AppLayout>
        }
      />

       <Route
        path='/chat/:id'
        element={
          <AppLayout pageTitle="chat">
            <ChatPage />
          </AppLayout>
        }
      />

             <Route
        path='/chat'
        element={
          <AppLayout pageTitle="chat">
            <ChatPage />
          </AppLayout>
        }
      />
             <Route
        path='/dashboard'
        element={
          <AppLayout pageTitle="Dashboard">
            <Dashboard />
          </AppLayout>
        }
      />
       
      <Route
        path='/datasets/:id/dashboard'
        element={
          <AppLayout pageTitle="Dashboard">
            <Dashboard/>
          </AppLayout>
        }
      />

            <Route
        path='/datasets/:id/charts'
        element={
          <AppLayout pageTitle="Chart Selector">
            <ChartSelectorPage/>
          </AppLayout>
        }
      />
      // Approutes.jsx — add this route, keep everything else you already have
<Route
  path='/print/datasets/:id/dashboard'
  element={<Dashboard printMode />}
/>
   
    
   </Routes>
  )
}

export default Approutes