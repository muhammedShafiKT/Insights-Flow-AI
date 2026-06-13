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

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL}/auth/google`}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-white/10"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.69-2.26 1.1-3.71 1.1-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.14c-.22-.69-.35-1.42-.35-2.14s.13-1.45.35-2.14V7.02H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.98z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.02l3.66 2.84c.87-2.6 3.3-4.48 6.16-4.48z"/>
            </svg>
            Continue with Google
          </a>
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