import { Link } from "react-router-dom"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import Navbar from "./Navbar"

const chartData = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 85 },
  { month: "Mar", value: 95 },
  { month: "Apr", value: 80 },
]

const stats = [
  { value: "12,000+", label: "Datasets Analysed" },
  { value: "98%", label: "Query Accuracy" },
  { value: "<2s", label: "Response Time" },
  { value: "500+", label: "Users" },
]

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" />
      </svg>
    ),
    bg: "bg-blue-500",
    title: "Upload & Process",
    desc: "Drag and drop CSV or XLSX files. We handle the rest with intelligent schema detection.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    bg: "bg-emerald-500",
    title: "Ask in English",
    desc: "Natural language queries powered by GPT-4. No SQL knowledge required.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    bg: "bg-orange-500",
    title: "Visualise Instantly",
    desc: "Auto-generated charts and dashboards. Pin your favorite insights.",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">

      {/* Navbar */}
   <Navbar/>

      {/* Hero */}
      <section className="relative overflow-hidden px-8 pt-24 pb-20">
        {/* bg grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
          }}
        />
        <div className="pointer-events-none absolute left-1/4 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight text-white">
              Upload Any Dataset.{" "}
              <span className="text-indigo-400">Ask Questions</span>{" "}
              in Plain English.
            </h1>
            <p className="mt-6 text-lg text-slate-400 max-w-lg">
              Transform your data into insights with AI-powered analytics. No SQL required.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-white transition shadow-[0_8px_30px_-8px_rgba(99,102,241,0.9)]"
              >
                Get Started Free
              </Link>
              <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-white transition">
                View Demo
              </button>
            </div>
          </div>

          {/* Right - AI Chart Card */}
          <div className="flex-1 w-full">
            <div className="rounded-2xl border border-indigo-500/30 bg-[#0f172a] p-5 shadow-[0_0_60px_-12px_rgba(99,102,241,0.4)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">AI</div>
                <span className="text-sm text-slate-300">Here's the sales trend for Q1 2026:</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={40}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: "#1e293b", border: "none", borderRadius: 8, color: "#f1f5f9" }}
                    cursor={{ fill: "rgba(99,102,241,0.1)" }}
                  />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-white/[0.02] px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-4xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-[#0f172a] p-7 hover:border-indigo-500/30 transition-all duration-300"
              >
                <div className={`h-14 w-14 rounded-2xl ${f.bg} flex items-center justify-center text-white mb-5 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Join 500+ users already turning data into decisions.</p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-white transition shadow-[0_8px_30px_-8px_rgba(99,102,241,0.9)]"
          >
            Start for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-slate-400 font-semibold">InsightFlow AI</span>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Product</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            {/* GitHub */}
            <a href="#" className="hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
              </svg>
            </a>
            {/* Twitter */}
            <a href="#" className="hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="#" className="hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

    </div>
  )
}