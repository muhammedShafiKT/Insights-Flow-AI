import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import api from "../../../services/api"
import { loginSuccess } from "../../../features/auth.slice"
import toast from "react-hot-toast"
import { useFormik } from "formik"
import * as Yup from "yup"

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const validationSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Enter a valid email")
      .required("Email is required")
    ,
    password: Yup.string()
      .required("Password is required")
  })
  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const res = await api.post("/auth/login", values)
        dispatch(loginSuccess(res.data.user))
        toast.success(res.data.message)
        navigate("/home")
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }
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
          <p className="mt-2 text-sm text-slate-400">Sign in to continue</p>
        </div>

        {/* Card */}
        <div className="relative rounded-2xl border border-white/10 bg-[#0f172a] p-7 shadow-[0_0_0_1px_rgba(99,102,241,0.06),0_20px_60px_-20px_rgba(0,0,0,0.8),0_0_50px_-12px_rgba(99,102,241,0.25)]">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="you@company.com"
                autoComplete="email"
                className={`w-full rounded-lg border bg-[#020617]/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition duration-200 focus:ring-4 ${formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-xs text-red-400">{formik.errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`w-full rounded-lg border bg-[#020617]/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition duration-200 focus:ring-4 ${formik.touched.password && formik.errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-white/10 focus:border-indigo-500 focus:ring-indigo-500/20"
                  }`}
              />
              {formik.touched.password && formik.errors.password && (
                <span className="text-xs text-red-400">{formik.errors.password}</span>
              )}
              
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.9)] transition duration-200 hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/40 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-indigo-400 transition-colors hover:text-indigo-300">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}