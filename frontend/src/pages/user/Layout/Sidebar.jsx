import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { logout } from "../../../features/auth.slice";

const NAV_ITEMS = [
  {
    label: "Datasets",
    to: "/datasets",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6c0-1.1 3.58-2 8-2s8 .9 8 2-3.58 2-8 2-8-.9-8-2zm0 0v12c0 1.1 3.58 2 8 2s8-.9 8-2V6M4 12c0 1.1 3.58 2 8 2s8-.9 8-2" />
      </svg>
    ),
  },
  {
    label: "Chat",
    to: "/chat",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 10.5h7.5m-7.5 3h4.5M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-3.815-.762L3 21l1.5-4.5C3.55 15.122 3 13.61 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    label: "Reports",
    to: "/reports",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h3.75V21H3v-7.5zM10.125 8.25h3.75V21h-3.75V8.25zM17.25 3h3.75v18h-3.75V3z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    to: "/settings",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.27 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar({
  workspaceName = "InsightFlow AI",
  planLabel = "Pro Workspace",
  isCollapsed = false,
}) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  }

  return (
    <aside 
      className={`flex h-screen flex-col border-r border-slate-800/60 bg-slate-950 transition-all duration-300 ease-in-out select-none ${
        isCollapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Top Brand Container */}
      <div className={`shrink-0 flex flex-col justify-center px-4 h-16 border-b border-slate-800/50 ${isCollapsed ? "items-center" : "pl-6"}`}>
        {!isCollapsed ? (
          <div className="animate-fadeIn">
            <h1 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-400 tracking-tight">
              {workspaceName}
            </h1>
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              {planLabel}
            </p>
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs font-black text-indigo-400 shadow-md shadow-indigo-500/5">
            IF
          </div>
        )}
      </div>

      {/* Navigation Space */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl font-medium transition-all duration-200 group relative ${
                  isCollapsed ? "h-10 w-10 justify-center mx-auto" : "px-4 py-2.5 gap-3 text-sm"
                } ${
                  isActive
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/10"
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-slate-200"
                }`
              }
            >
              {item.icon}
              
              {!isCollapsed && (
                <span className="truncate transition-opacity duration-200 animate-fadeIn">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer Profile Layer */}
      <div className={`border-t border-slate-800/60 bg-slate-950 p-3 flex flex-col gap-2 ${isCollapsed ? "items-center" : ""}`}>
        <NavLink
          to="/profile"
          title={isCollapsed ? `${user?.name || 'User'} (${user?.email})` : undefined}
          className={`flex items-center rounded-xl hover:bg-slate-900/60 transition-colors ${
            isCollapsed ? "h-10 w-10 justify-center" : "p-2.5 gap-3"
          }`}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold overflow-hidden shadow-inner">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          {!isCollapsed && (
            <div className="min-w-0 flex-1 animate-fadeIn">
              <p className="truncate text-xs font-semibold text-slate-200">
                {user?.name || "User Frame"}
              </p>
              <p className="truncate text-[10px] text-slate-500 font-medium mt-0.5">
                {user?.email || "user@insightflow.ai"}
              </p>
            </div>
          )}
        </NavLink>

        <button
          onClick={handleLogout}
          title={isCollapsed ? "Logout Account" : undefined}
          className={`flex items-center justify-center rounded-xl border border-rose-500/10 text-rose-400/90 transition-all hover:bg-rose-500/10 hover:text-rose-400 ${
            isCollapsed ? "h-10 w-10 p-0 border-none" : "w-full px-3 py-2 text-xs font-medium mt-1"
          }`}
        >
          {isCollapsed ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          ) : (
            "Logout Account"
          )}
        </button>
      </div>
    </aside>
  );
}