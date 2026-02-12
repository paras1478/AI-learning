import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, BookOpen, User } from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Documents", icon: FileText, path: "/documents" },
  { name: "Flashcards", icon: BookOpen, path: "/flashcards" },
  { name: "Profile", icon: User, path: "/profile" },
];

const Sidebar = ({ isOpen }) => {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-screen w-68
        bg-white border-r px-4 py-6
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
          AI
        </div>
        <h1 className="text-lg font-semibold whitespace-nowrap">
          AI Learning Assistant
        </h1>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
              ${
                isActive
                  ? "bg-emerald-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
