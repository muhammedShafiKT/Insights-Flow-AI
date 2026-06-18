const NAV_ITEMS = [
  {
    label: "Datasets",
    to: "/workspace",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6c0-1.1 3.58-2 8-2s8 .9 8 2-3.58 2-8 2-8-.9-8-2zm0 0v12c0 1.1 3.58 2 8 2s8-.9 8-2V6M4 12c0 1.1 3.58 2 8 2s8-.9 8-2"
        />
      </svg>
    ),
  },
  {
    label: "Chat",
    to: "/chat",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 10.5h7.5m-7.5 3h4.5M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-3.815-.762L3 21l1.5-4.5C3.55 15.122 3 13.61 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
        />
      </svg>
    ),
  },
  {
    label: "Reports",
    to: "/reports",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5h3.75V21H3v-7.5zM10.125 8.25h3.75V21h-3.75V8.25zM17.25 3h3.75v18h-3.75V3z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    to: "/settings",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.27 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];


import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { logout } from "../../../features/auth.slice";

export default function Sidebar({
  workspaceName = "InsightFlow AI",
  planLabel = "Pro Workspace",
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
    <aside className="flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950">
      {/* Top */}
      <div className="flex-1 px-6 py-8">
        <div className="mb-10">
          <h1 className="text-xl font-bold text-indigo-200">
            {workspaceName}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {planLabel}
          </p>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-500 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-900 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 font-semibold overflow-hidden">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user?.name}
                className="h-full w-full object-cover"
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user?.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {user?.email}
            </p>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="mt-2 w-full rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}