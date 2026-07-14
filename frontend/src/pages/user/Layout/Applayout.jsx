import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar.jsx";
import UserMenu from "./UserMenu.jsx";

export default function AppLayout({ pageTitle = "Workspace", children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 antialiased">
      {/* Pass sidebarOpen to your Sidebar component so it can change its internal width,
        hide text labels, or completely slide out of view.
      */}
      <Sidebar user={user} isCollapsed={!sidebarOpen} />

      <div className="flex flex-1 flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="relative flex h-16 shrink-0 items-center justify-between border-b border-slate-800/60 bg-slate-950/50 px-6 backdrop-blur-md">
          <div className="flex items-center gap-4 min-w-0">
            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/30 text-slate-400 transition-all hover:bg-slate-800 hover:text-slate-200 active:scale-95"
              aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <svg 
                className={`h-5 w-5 transition-transform duration-300 ease-out ${sidebarOpen ? "" : "rotate-180"}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={1.8}
              >
                {/* Modern "fold-back" arrow menu indicator */}
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            
            <h1 className="truncate text-sm font-semibold tracking-tight text-slate-100">
              {pageTitle}
            </h1>
          </div>

          {/* Actions panel */}
          <div className="flex items-center gap-3">
            <button 
              type="button" 
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200" 
              aria-label="Notifications"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
            <button 
              type="button" 
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-200" 
              aria-label="Help"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45 1.005-1.45 1.827v.227M12 18.75h.007v.008H12v-.008z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75a9.75 9.75 0 100-19.5 9.75 9.75 0 000 19.5z" />
              </svg>
            </button>

            <div className="h-4 w-px bg-slate-800/80 mx-1" />

            <button
              type="button"
              onClick={() => setUserMenuOpen((prev) => !prev)}
              title="Account"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold overflow-hidden shadow-inner transition-transform hover:scale-105 active:scale-95"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </button>

            <UserMenu
              isOpen={isUserMenuOpen}
              onClose={() => setUserMenuOpen(false)}
            />
          </div>
        </header>

        {/* Scrollable App Body Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}