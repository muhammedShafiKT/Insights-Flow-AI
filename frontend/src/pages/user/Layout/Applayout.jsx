import Sidebar from "./Sidebar.jsx";

export default function AppLayout({ pageTitle = "Workspace", user, children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar user={user} />

      <div className="flex-1 overflow-y-auto">
        <header className="flex items-center justify-between border-b border-slate-800 px-8 py-5">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
            <h1 className="text-lg font-semibold text-slate-50">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button type="button" className="text-slate-400 hover:text-slate-200" aria-label="Notifications">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </button>
            <button type="button" className="text-slate-400 hover:text-slate-200" aria-label="Help">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45 1.005-1.45 1.827v.227M12 18.75h.007v.008H12v-.008z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75a9.75 9.75 0 100-19.5 9.75 9.75 0 000 19.5z" />
              </svg>
            </button>
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-medium text-white">
                {user?.name?.[0]?.toUpperCase() || "?"}
              </div>
            )}
          </div>
        </header>

        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}