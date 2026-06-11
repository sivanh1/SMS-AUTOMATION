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
  Menu,
  MessageCircle
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

  // REFINED MATERIAL 3 NAV STYLING WITH SLEEK HOVERS & SHADOWS
  const navClass = (active) =>
    `flex items-center text-sm transition-all duration-200 whitespace-nowrap group relative ${isOpen
      ? "mx-3 px-5 py-3 rounded-2xl my-1 gap-4"
      : "h-12 w-12 mx-auto justify-center rounded-2xl my-1.5"
    } ${active
      ? `
          bg-gradient-to-r from-[#d3e3fd]/90 to-[#d3e3fd]/50 
          dark:from-[#004b87]/80 dark:to-[#004b87]/40
          text-[#041e49] 
          dark:text-[#e2e2e2] 
          font-semibold
          shadow-sm ring-1 ring-black/5 dark:ring-white/10
        `
      : `
          text-[#444746] 
          dark:text-[#c4c7c5] 
          hover:bg-gray-200/50 
          dark:hover:bg-[#2d323f]/60 
          font-medium
        `
    }`;

  // CUSTOM TOOLTIP COMPONENT FOR COLLAPSED STATE
  const NavTooltip = ({ text }) => (
    !isOpen && (
      <span className="absolute left-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold px-2.5 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl border border-white/10 z-50 whitespace-nowrap">
        {text}
        <span className="absolute top-1/2 -left-1 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900 dark:border-r-white"></span>
      </span>
    )
  );

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
        z-40
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

        {/* HEADER SECTION (BRAND LAYOUT) */}
        <div className={`flex items-center mb-6 px-4 gap-3 flex-shrink-0 pt-1 ${isOpen ? "justify-start" : "justify-center"}`}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="
              p-2.5 
              rounded-xl 
              text-[#444746] 
              dark:text-[#c4c7c5] 
              hover:bg-white
              dark:hover:bg-[#2d323f]
              hover:shadow-sm
              transition-all
              duration-200
            "
          >
            <Menu size={20} className="transition-transform duration-200 active:scale-95" />
          </button>

          {isOpen && (
            <div className="flex items-center gap-2.5 select-none overflow-hidden transition-opacity duration-300 animate-in fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <MessageCircleMore size={18} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                SMS CRM
              </span>
            </div>
          )}
        </div>

        {/* PROFILE BLOCK - GLASSMORPHISM EFFECT */}
        <div
          className={`
            flex items-center
            bg-white/60 backdrop-blur-md
            dark:bg-[#222834]/80
            border
            border-white/40
            dark:border-[#2d323f]/80
            shadow-sm
            transition-all
            duration-300
            rounded-2xl
            flex-shrink-0
            ${isOpen ? "p-3 mx-4 gap-3 mb-6" : "p-2 mb-6 justify-center w-12 h-12 mx-auto ring-1 ring-black/5 dark:ring-white/5"}
          `}
        >
          <div className="relative">
            <UserCircle size={isOpen ? 32 : 26} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" strokeWidth={1.5} />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#222834] rounded-full"></div>
          </div>

          {isOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <p className="text-sm font-bold text-gray-800 dark:text-[#f1f1f1] truncate tracking-tight">
                {username || "Operator Active"}
              </p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-[#0b57d0] dark:text-[#a8c7fa] mt-0.5">
                {role}
              </p>
            </div>
          )}
        </div>

        {/* INDEPENDENTLY SCROLLABLE NAVIGATION LINKS */}
        <nav className="flex flex-col flex-1 overflow-y-auto no-scrollbar pb-4 overflow-x-visible">
          {/* ADMIN ENVIRONMENT */}
          {role === "admin" && (
            <>
              <Link to="/admin" className={navClass(location.pathname === "/admin")}>
                <LayoutDashboard size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>Dashboard</span>}
                <NavTooltip text="Dashboard" />
              </Link>

              <Link to="/admin/customers" className={navClass(location.pathname.includes("/customers"))}>
                <Users size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>Customers</span>}
                <NavTooltip text="Customers" />
              </Link>

              <Link to="/admin/templates" className={navClass(location.pathname.includes("/templates"))}>
                <FileText size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>Templates</span>}
                <NavTooltip text="Templates" />
              </Link>

              <Link to="/admin/logs" className={navClass(location.pathname.includes("/logs"))}>
                <ClipboardList size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>Logs</span>}
                <NavTooltip text="Logs" />
              </Link>

              <Link to="/admin/addusers" className={navClass(location.pathname.includes("/addusers"))}>
                <Plus size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>Add Users</span>}
                <NavTooltip text="Add Users" />
              </Link>
              <Link to="/admin/queries" className={navClass(location.pathname.includes("/queries"))}>
                <MessageCircle size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>Support Queries</span>}
                <NavTooltip text="Support Queries" />
              </Link>
            </>
          )}

          {/* OPERATOR ENVIRONMENT */}
          {role === "operator" && (
            <>
              <Link to="/operator" className={navClass(location.pathname === "/operator")}>
                <Send size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>SMS Sender</span>}
                <NavTooltip text="SMS Sender" />
              </Link>

              <Link to="/operator/bulksms" className={navClass(location.pathname === "/operator/bulksms")}>
                <MessageCircleMore size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>Bulk SMS</span>}
                <NavTooltip text="Bulk SMS" />
              </Link>
              <Link to="/operator/operatorlogs" className={navClass(location.pathname.includes("/operatorlogs"))}>
                <ClipboardList size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>My Logs</span>}
                <NavTooltip text="My Logs" />
              </Link>
              <Link to="/operator/queries" className={navClass(location.pathname.includes("/queries"))}>
                <MessageCircle size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                {isOpen && <span>My Queries</span>}
                <NavTooltip text="My Queries" />
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* LOWER FOOTER CONFIG */}
      <div className="flex flex-col gap-1.5 pt-3 mt-auto border-t border-gray-200/50 dark:border-[#2d323f]/50 flex-shrink-0 relative overflow-visible">
        {/* THEME CONTROL BUTTON */}
        <button
          onClick={toggleTheme}
          className={`
            flex items-center
            text-sm
            font-medium
            text-[#444746]
            dark:text-[#c4c7c5]
            hover:bg-gray-200/60
            dark:hover:bg-[#2d323f]
            transition-all
            duration-200
            whitespace-nowrap
            group
            relative
            ${isOpen ? "mx-3 px-5 py-3 rounded-2xl gap-4 text-left" : "h-12 w-12 mx-auto justify-center rounded-2xl"}
          `}
        >
          {darkMode ? (
            <Sun size={20} className="flex-shrink-0 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon size={20} className="flex-shrink-0 text-indigo-500 group-hover:-rotate-12 transition-transform duration-300" />
          )}
          {isOpen && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          <NavTooltip text={darkMode ? "Light Mode" : "Dark Mode"} />
        </button>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className={`
            flex items-center
            text-sm
            font-medium
            text-rose-600
            dark:text-rose-400
            hover:bg-rose-50
            dark:hover:bg-rose-500/10
            transition-all
            duration-200
            whitespace-nowrap
            group
            relative
            ${isOpen ? "mx-3 px-5 py-3 rounded-2xl gap-4 text-left" : "h-12 w-12 mx-auto justify-center rounded-2xl"}
          `}
        >
          <LogOut size={20} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform duration-200" />
          {isOpen && <span>Logout Account</span>}
          <NavTooltip text="Logout" />
        </button>
      </div>
    </div>
  );
}