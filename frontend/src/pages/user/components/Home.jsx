import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import { useSelector } from "react-redux"

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    title: "Instant Uploads",
    desc: "Drop CSV, XLSX, or JSON files directly into the workspace. Our engine auto-detects schemas and prepares data for immediate analysis.",
    link: "Learn more",
    highlight: false,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Natural Language Queries",
    desc: 'Forget complex SQL. Simply ask "Which product had the highest margin in July?" and get a detailed response with citations from your data source.',
    link: "Try queries",
    highlight: true,
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    title: "Auto-Dashboards",
    desc: "InsightFlow automatically generates multi-view dashboards based on the shape of your data. Highlighting trends and anomalies before you even ask.",
    link: "View samples",
    highlight: false,
  },
]

// Deterministic bar heights for the terminal chart (no randomness => stable render)
const bars = [
  20, 28, 18, 35, 30, 45, 40, 55, 50, 65, 58, 72, 68, 80, 75, 88, 82, 95, 90,
  98, 92, 85, 78, 70,
]

export default function Home() {
  const user = useSelector((state)=>state.auth.user)
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white font-sans">
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-8 pt-20 pb-16 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 60% at 50% 30%, black 30%, transparent 75%)",
          }}
        />
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" />
            </svg>
            NEXT-GEN INTELLIGENCE
          </span>

          <h1 className="mt-6 text-5xl md:text-6xl font-bold leading-tight tracking-tight">
            <span className="text-indigo-400">AI-Powered Data Analytics</span> for
            <br />
            the Modern Enterprise
          </h1>

          <p className="mt-6 text-base text-slate-400 max-w-xl mx-auto">
            Transform messy data into actionable intelligence. Use natural language to
            query, visualize, and scale your insights across the entire organization
            instantly.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to={user ? "/datasets" : "/register"}
              className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 font-semibold text-white transition shadow-[0_8px_30px_-8px_rgba(99,102,241,0.9)]"
            >              Get Started Free
            </Link>
            <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 font-semibold text-white transition">
              Request Demo
            </button>
          </div>
        </div>

        {/* Terminal card */}
        <div className="relative max-w-4xl mx-auto mt-16">
          <div className="rounded-2xl border border-white/10 bg-[#0d1326] shadow-[0_0_60px_-12px_rgba(99,102,241,0.4)] overflow-hidden text-left">
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
              <span className="h-3 w-3 rounded-full bg-green-400/80" />
              <span className="ml-2 text-xs text-slate-400">InsightFlow Analysis Terminal v2.4</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="h-5 w-16 rounded bg-white/5" />
                <span className="h-5 w-5 rounded bg-white/5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-5 p-5">
              {/* AI assistant panel */}
              <div className="rounded-xl border border-white/5 bg-[#0a0f1e] p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  AI Assistant
                </div>
                <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-300">
                  "Show me the revenue growth by region for Q3."
                </div>
                <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 text-xs text-indigo-200">
                  Processing query... Generating visualization for EMEA and APAC regions.
                </div>
              </div>

              {/* Chart panel */}
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-white/5 bg-[#0a0f1e] p-4 h-[180px] flex items-end gap-1">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(to top, #6366f1, #a855f7 ${100 - h}%)`,
                      }}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-[#0a0f1e] p-3 text-center">
                    <div className="text-xs text-slate-400">Growth Index</div>
                    <div className="mt-1 text-lg font-bold text-indigo-300">+24.8%</div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-[#0a0f1e] p-3 text-center">
                    <div className="text-xs text-slate-400">Confidence Score</div>
                    <div className="mt-1 text-lg font-bold text-indigo-300">98.2%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Powerful Features for Data Teams</h2>
          <p className="text-slate-400 mb-12">
            Everything you need to turn raw data into decisions in minutes, not days.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {features.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border p-7 transition-all duration-300 ${f.highlight
                    ? "border-indigo-500/40 bg-[#0f1730]"
                    : "border-white/10 bg-[#0f172a] hover:border-indigo-500/30"
                  }`}
              >
                <div
                  className={`h-11 w-11 rounded-xl flex items-center justify-center mb-5 ${f.highlight ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-300"
                    }`}
                >
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">{f.desc}</p>
                <a href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1">
                  {f.link} <span aria-hidden>→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl bg-indigo-400 px-8 py-16 text-center">
          <h2 className="text-4xl font-bold text-indigo-950 mb-4">Ready to unlock your data?</h2>
          <p className="text-indigo-900/80 mb-8 max-w-xl mx-auto">
            Join 500+ enterprises leveraging InsightFlow AI to stay ahead of the curve.
            Get started with a 14-day free trial today.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to={user?"/datasets":"/register"}
              className="px-6 py-3 rounded-xl bg-[#0a0f1e] hover:bg-[#11182f] font-semibold text-white transition"
            >
              Get Started Now
            </Link>
            <button className="px-6 py-3 rounded-xl bg-indigo-300/40 hover:bg-indigo-300/60 font-semibold text-indigo-950 transition">
              Talk to Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8">
          <div>
            <span className="text-white font-semibold">InsightFlow AI</span>
            <p className="mt-3 text-sm text-slate-400 max-w-xs">
              Empowering data-driven decisions with next-generation artificial
              intelligence and intuitive analytics tools.
            </p>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-300 mb-3">PRODUCT</div>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Features</a>
              <a href="#" className="hover:text-white transition-colors">Integrations</a>
              <a href="#" className="hover:text-white transition-colors">Enterprise</a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-300 mb-3">RESOURCES</div>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API Reference</a>
              <a href="#" className="hover:text-white transition-colors">Blog</a>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-300 mb-3">COMPANY</div>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-slate-500">© 2024 InsightFlow AI. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#" className="hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}