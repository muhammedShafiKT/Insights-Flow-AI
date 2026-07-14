import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const MENU_ITEMS = [
  { label: "Edit Profile", to: "/profile" },
  { label: "Change Password", to: "/forgot-password" },
];

export default function UserMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSelect(to) {
    onClose();
    navigate(to);
  }

  return (
    <div
      ref={menuRef}
      className="absolute right-6 top-14 z-50 w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl shadow-black/40"
    >
      {MENU_ITEMS.map((item) => (
        <button
          key={item.to}
          type="button"
          onClick={() => handleSelect(item.to)}
          className="block w-full px-4 py-2.5 text-left text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-slate-100"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}