import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  LogOut,
  Send,
  UserCircle,
  Plus,
  Moon,
  Sun,
  MessageCircleMore,
  Menu 
} from "lucide-react";

import {
  useTheme,
} from "../context/ThemeContext";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // GMAIL MATERIAL 3 NAV STYLING
  const navClass = (active) =>
    `flex items-center text-sm transition-all duration-150 whitespace-nowrap group relative ${
      isOpen 
        ? "mx-3 px-6 py-2.5 rounded-full my-0.5 gap-4" 
        : "h-12 w-12 mx-auto justify-center rounded-full my-1"
    } ${
      active
        ? `
          bg-[#d3e3fd] 
          dark:bg-[#004b87] 
          text-[#041e49] 
          dark:text-[#e2e2e2] 
          font-semibold
        `
        : `
          text-[#444746] 
          dark:text-[#c4c7c5] 
          hover:bg-gray-200/60 
          dark:hover:bg-[#2d323f] 
          font-medium
        `
    }`;

  return (
    <div
      className={`
        h-screen
        bg-[#f6f8fc]
        dark:bg-[#1a1f2c]
        border-r
        border-transparent
        dark:border-[#2d323f]
        py-4
        transition-all
        duration-300
        overflow-hidden
        flex
        flex-col
        justify-between
        sticky
        top-0
        ${isOpen ? "w-64" : "w-20"} 
      `}
    >
      {/* TOP SECTION & SCROLLABLE NAV WRAPPER */}
      <div className="flex flex-col flex-1 min-h-0">
        
        {/* HEADER SECTION (GMAIL BRAND LAYOUT) */}
        <div className={`flex items-center mb-5 px-4 gap-3 flex-shrink-0 ${isOpen ? "justify-start" : "justify-center"}`}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="
              p-2.5 
              rounded-full 
              text-[#444746] 
              dark:text-[#c4c7c5] 
              hover:bg-gray-200/70
              dark:hover:bg-[#2d323f]
              transition-colors
            "
          >
            <Menu size={20} />
          </button>
          
          {isOpen && (
            <div className="flex items-center gap-2 select-none animate-fadeIn">
              <span className="text-xl font-semibold tracking-tight text-[#1f1f1f] dark:text-[#e3e3e3]">
                SMS CRM
              </span>
            </div>
          )}
        </div>

        {/* PROFILE BLOCK */}
        <div
          className={`
            flex items-center
            bg-white/80
            dark:bg-[#222834]
            border
            border-gray-200/60
            dark:border-[#2d323f]
            transition-all
            duration-300
            rounded-2xl
            flex-shrink-0
            ${isOpen ? "p-3 mx-4 gap-3 mb-5" : "p-2 mb-5 justify-center w-12 h-12 mx-auto"}
          `}
        >
          <UserCircle size={26} className="text-gray-400 dark:text-slate-400 flex-shrink-0" />
          {isOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-xs font-semibold text-gray-700 dark:text-[#e3e3e3] truncate">
                {username || "Operator Active"}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#0b57d0] dark:text-[#a8c7fa] mt-0.5">
                {role}
              </p>
            </div>
          )}
        </div>

        {/* INDEPENDENTLY SCROLLABLE NAVIGATION LINKS */}
        <nav className="flex flex-col flex-1 overflow-y-auto no-scrollbar pb-4">
          {/* ADMIN ENVIRONMENT */}
          {role === "admin" && (
            <>
              <Link to="/admin" className={navClass(location.pathname === "/admin")} title="Dashboard">
                <LayoutDashboard size={20} className="flex-shrink-0" />
                {isOpen && <span>Dashboard</span>}
              </Link>

              <Link to="/admin/customers" className={navClass(location.pathname.includes("/customers"))} title="Customers">
                <Users size={20} className="flex-shrink-0" />
                {isOpen && <span>Customers</span>}
              </Link>

              <Link to="/admin/templates" className={navClass(location.pathname.includes("/templates"))} title="Templates">
                <FileText size={20} className="flex-shrink-0" />
                {isOpen && <span>Templates</span>}
              </Link>

              <Link to="/admin/logs" className={navClass(location.pathname.includes("/logs"))} title="Logs">
                <ClipboardList size={20} className="flex-shrink-0" />
                {isOpen && <span>Logs</span>}
              </Link>

              <Link to="/admin/addusers" className={navClass(location.pathname.includes("/addusers"))} title="Add Users">
                <Plus size={20} className="flex-shrink-0" />
                {isOpen && <span>Add Users</span>}
              </Link>
            </>
          )}

          {/* OPERATOR ENVIRONMENT */}
          {role === "operator" && (
            <>
              

              <Link to="/operator" className={navClass(location.pathname === "/operator")} title="SMS Sender">
                <Send size={20} className="flex-shrink-0" />
                {isOpen && <span>SMS Sender</span>}
              </Link>

              <Link to="/operator/bulksms" className={navClass(location.pathname === "/operator/bulksms")} title="Bulk SMS">
                <MessageCircleMore size={20} className="flex-shrink-0" />
                {isOpen && <span>Bulk SMS</span>}
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* LOWER FOOTER CONFIG (Locked static at bottom) */}
      <div className="flex flex-col gap-1 pt-2 mt-auto border-t border-gray-200/40 dark:border-[#2d323f]/40 flex-shrink-0">
        {/* THEME CONTROL BUTTON */}
        <button
          onClick={toggleTheme}
          title={darkMode ? "Light Mode" : "Dark Mode"}
          className={`
            flex items-center
            text-sm
            font-medium
            text-[#444746]
            dark:text-[#c4c7c5]
            hover:bg-gray-200/60
            dark:hover:bg-[#2d323f]
            transition-all
            duration-150
            whitespace-nowrap
            ${isOpen ? "mx-3 px-6 py-2.5 rounded-full gap-4 text-left" : "h-12 w-12 mx-auto justify-center rounded-full"}
          `}
        >
          {darkMode ? <Sun size={20} className="flex-shrink-0 text-amber-500" /> : <Moon size={20} className="flex-shrink-0" />}
          {isOpen && <span>Change Theme</span>}
        </button>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          title="Logout"
          className={`
            flex items-center
            text-sm
            font-medium
            text-rose-600
            dark:text-rose-400
            hover:bg-rose-50/60
            dark:hover:bg-rose-950/20
            transition-all
            duration-150
            whitespace-nowrap
            ${isOpen ? "mx-3 px-6 py-2.5 rounded-full gap-4 text-left" : "h-12 w-12 mx-auto justify-center rounded-full"}
          `}
        >
          <LogOut size={20} className="flex-shrink-0" />
          {isOpen && <span>Logout Account</span>}
        </button>
      </div>
    </div>
  );
}