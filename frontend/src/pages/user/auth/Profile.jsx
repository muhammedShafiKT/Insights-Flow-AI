import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { updateUser } from "../../../features/auth.slice";

export default function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.patch("/auth/update-name", { name: name.trim() });
      dispatch(updateUser({ name: res.data.user.name }));
      setSuccess(true);
      navigate("/home");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update name.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl shadow-black/40">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-100">Edit Profile</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-900 hover:text-slate-200"
            aria-label="Go back"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/40"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-900/30 px-3 py-2 text-sm text-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Name"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-xs font-medium text-rose-400">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-xs font-medium text-emerald-400">
            Name updated successfully.
          </p>
        )}

        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          className="mt-3 w-full rounded-xl border border-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}