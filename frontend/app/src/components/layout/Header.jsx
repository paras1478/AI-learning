import React from "react";
import { Menu, Bell, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header
      className="
        h-16 bg-white border-b border-slate-200
        flex items-center justify-between px-6
        relative z-50
      "
    >
      <button
        onClick={toggleSidebar}
        className="
          flex items-center justify-center
          w-10 h-10 rounded-lg
          hover:bg-slate-100 transition
        "
      >
        <Menu size={22} className="text-black" />
      </button>

      <div className="flex items-center gap-4">
        <Bell className="text-slate-600" />

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <User size={18} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-semibold">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.email || "user@email.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
