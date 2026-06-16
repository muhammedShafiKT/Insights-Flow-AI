import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../../features/auth.slice'
import { useNavigate } from 'react-router-dom'
import api from '../../../services/api'

function Navbar() {
  const user = useSelector((state) => state.auth.user)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      const res = await api.post("/auth/logout")
      console.log("logout res", res)
    } catch (err) {
      console.log("logout error", err)
    } finally {
      dispatch(logout())
      navigate("/login")
    }
  }

  return (
    <div>
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_20px_-2px_rgba(99,102,241,0.8)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18" /><path d="m7 14 3-4 3 3 4-6" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">InsightFlow AI</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Features</a>
          <a href="#" className="hover:text-white transition-colors">Pricing</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>

        {/* Show different UI based on auth state */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {/* Avatar with first letter of name */}
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-sm font-semibold text-indigo-400">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-slate-300">Hi, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 transition px-4 py-1.5 rounded-lg shadow-[0_0_20px_-4px_rgba(99,102,241,0.8)]">
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar