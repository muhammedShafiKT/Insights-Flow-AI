import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"


import toast from "react-hot-toast"
import api from "../../../services/api"
import { loginSuccess } from "../../../features/auth.slice"

export default function VerifyOtp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { state } = useLocation()
  const email = state?.email

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

async function handleSubmit(e) {
  e.preventDefault()

  try {
    setLoading(true)

    const res = await api.post("/auth/verify-otp", {
      email,
      otp
    })

    toast.success(res.data.message)
dispatch(loginSuccess(res.data.user))

    navigate("/home")

  } catch (err) {
    console.log(err)

    toast.error(
      err.response?.data?.message ||
      err.message ||
      "Something went wrong"
    )
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-12 font-sans text-slate-200">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 shadow-[0_0_30px_-4px_rgba(99,102,241,0.8)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M3 3v18h18" />
              <path d="m7 14 3-4 3 3 4-6" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white [text-shadow:0_0_24px_rgba(99,102,241,0.45)]">
            InsightFlow
          </h1>
          <p className="mt-2 text-sm text-slate-400">Enter the OTP sent to <span className="text-indigo-400">{email}</span></p>
        </div>

        <div className="relative rounded-2xl border border-white/10 bg-[#0f172a] p-7 shadow-[0_0_0_1px_rgba(99,102,241,0.06),0_20px_60px_-20px_rgba(0,0,0,0.8),0_0_50px_-12px_rgba(99,102,241,0.25)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-300">OTP Code</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full rounded-lg border border-white/10 bg-[#020617]/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.9)] transition duration-200 hover:bg-indigo-400 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}