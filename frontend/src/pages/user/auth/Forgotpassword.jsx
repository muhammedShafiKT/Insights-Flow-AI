import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../../../services/api"
import toast from "react-hot-toast"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1 = email, 2 = otp + new password
  const [loading, setLoading] = useState(false)

  const emailSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required"),
  })

  const resetSchema = Yup.object({
    otp: Yup.string()
      .trim()
      .required("OTP is required"),
    newPassword: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
  })

  const emailFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: emailSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const res = await api.post("/auth/forgot-password", values)
        toast.success(res.data.message)
        setStep(2)
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    },
  })

  const resetFormik = useFormik({
    initialValues: { otp: "", newPassword: "" },
    validationSchema: resetSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const res = await api.post("/auth/reset-password", {
          email: emailFormik.values.email,
          ...values,
        })
        toast.success(res.data.message)
        navigate("/login")
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020617] px-4 py-12 font-sans text-slate-200">
      {/* Background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
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
          <p className="mt-2 text-sm text-slate-400">
            {step === 1 ? "Reset your password" : "Check your email for the OTP"}
          </p>
        </div>

        {/* Step indicators */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className={`h-2 w-8 rounded-full transition-all ${step >= 1 ? "bg-indigo-500" : "bg-slate-700"}`} />
          <div className={`h-2 w-8 rounded-full transition-all ${step >= 2 ? "bg-indigo-500" : "bg-slate-700"}`} />
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-white/10 bg-[#0f172a] p-7 shadow-[0_0_0_1px_rgba(99,102,241,0.06),0_20px_60px_-20px_rgba(0,0,0,0.8),0_0_50px_-12px_rgba(99,102,241,0.25)]">

          {/* Step 1 - Email */}
          {step === 1 && (
            <form onSubmit={emailFormik.handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={emailFormik.values.email}
                  onChange={emailFormik.handleChange}
                  onBlur={emailFormik.handleBlur}
                  placeholder="you@company.com"
                  autoComplete="email"
                  className={`w-full rounded-lg border bg-[#020617]/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition duration-200 focus:ring-4 ${
                    emailFormik.touched.email && emailFormik.errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
                {emailFormik.touched.email && emailFormik.errors.email && (
                  <span className="text-xs text-red-400">{emailFormik.errors.email}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.9)] transition duration-200 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* Step 2 - OTP + New Password */}
          {step === 2 && (
            <form onSubmit={resetFormik.handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="otp" className="text-sm font-medium text-slate-300">
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={resetFormik.values.otp}
                  onChange={resetFormik.handleChange}
                  onBlur={resetFormik.handleBlur}
                  placeholder="Enter OTP from email"
                  className={`w-full rounded-lg border bg-[#020617]/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition duration-200 focus:ring-4 ${
                    resetFormik.touched.otp && resetFormik.errors.otp
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
                {resetFormik.touched.otp && resetFormik.errors.otp && (
                  <span className="text-xs text-red-400">{resetFormik.errors.otp}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-slate-300">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={resetFormik.values.newPassword}
                  onChange={resetFormik.handleChange}
                  onBlur={resetFormik.handleBlur}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border bg-[#020617]/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition duration-200 focus:ring-4 ${
                    resetFormik.touched.newPassword && resetFormik.errors.newPassword
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
                />
                {resetFormik.touched.newPassword && resetFormik.errors.newPassword && (
                  <span className="text-xs text-red-400">{resetFormik.errors.newPassword}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.9)] transition duration-200 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-center text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                Wrong email? Go back
              </button>
            </form>
          )}

        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Remember your password?{" "}
          <Link to="/login" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}