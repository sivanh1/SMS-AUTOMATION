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
  MessageCircleMore
} from "lucide-react";

import {
  useTheme,
} from "../context/ThemeContext";

export default function Sidebar() {

  const role =
    localStorage.getItem("role");

  const username =
    localStorage.getItem("username");

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    darkMode,
    toggleTheme,
  } = useTheme();

  // LOGOUT
  const handleLogout = () => {

    localStorage.clear();

    navigate("/");
  };

  // NAVIGATION STYLE
  const navClass = (active) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
      active
        ? `
          bg-gray-100
          dark:bg-[#222222]

          text-gray-900
          dark:text-[#e5e5e5]
        `
        : `
          text-gray-600
          dark:text-[#9ca3af]

          hover:bg-gray-100
          dark:hover:bg-[#1c1c1c]

          hover:text-gray-900
          dark:hover:text-[#e5e5e5]
        `
    }`;

  return (

    <div
      className="
        w-60
        min-h-screen

        bg-white
        dark:bg-[#121212]

        border-r
        border-gray-200
        dark:border-[#2a2a2a]

        p-4

        transition-colors
        duration-300
      "
    >

      {/* LOGO */}
      <div className="mb-8">

        <h1
          className="
            text-2xl
            font-semibold

            text-gray-900
            dark:text-[#e5e5e5]
          "
        >
          SMS
        </h1>

        <p
          className="
            text-sm

            text-gray-500
            dark:text-[#9ca3af]

            mt-1
          "
        >
          Automation System
        </p>

      </div>

      {/* USER CARD */}
      <div
        className="
          flex items-center gap-3

          bg-gray-50
          dark:bg-[#181818]

          border
          border-gray-200
          dark:border-[#2a2a2a]

          rounded-xl

          p-4
          mb-8

          transition-colors
          duration-300
        "
      >

        <UserCircle
          size={34}
          className="
            text-gray-500
            dark:text-[#9ca3af]
          "
        />

        <div>

          <p
            className="
              text-sm
              font-medium

              text-gray-900
              dark:text-[#e5e5e5]
            "
          >
            {username}
          </p>

          <p
            className="
              text-xs
              capitalize

              text-gray-500
              dark:text-[#9ca3af]
            "
          >
            {role}
          </p>

        </div>

      </div>

      {/* ADMIN MENU */}
      {role === "admin" && (

        <div className="space-y-1">

          <Link
            to="/admin"
            className={navClass(
              location.pathname === "/admin"
            )}
          >

            <LayoutDashboard size={18} />

            Dashboard

          </Link>

          <Link
            to="/admin/customers"
            className={navClass(
              location.pathname.includes(
                "/customers"
              )
            )}
          >

            <Users size={18} />

            Customers

          </Link>

          <Link
            to="/admin/templates"
            className={navClass(
              location.pathname.includes(
                "/templates"
              )
            )}
          >

            <FileText size={18} />

            Templates

          </Link>

          <Link
            to="/admin/logs"
            className={navClass(
              location.pathname.includes(
                "/logs"
              )
            )}
          >

            <ClipboardList size={18} />

            Logs

          </Link>

          <Link
            to="/admin/addusers"
            className={navClass(
              location.pathname.includes(
                "/addusers"
              )
            )}
          >

            <Plus size={18} />

            Add Users

          </Link>

        </div>

      )}

      {/* OPERATOR MENU */}
      {role === "operator" && (

        <div className="space-y-1">

          <Link
            to="/operator/customers"
            className={navClass(
              location.pathname.includes(
                "/customers"
              )
            )}
          >

            <Users size={18} />

            Customers

          </Link>

          <Link
            to="/operator"
            className={navClass(
              location.pathname === "/operator"
            )}
          >

            <Send size={18} />

            SMS Sender

          </Link>
          <Link
            to="/operator/bulksms"
            className={navClass(
              location.pathname === "/operator/bulksms"
            )}
          >

            <MessageCircleMore size={18} />

            Bulk SMS

          </Link>

        </div>

      )}

      {/* FOOTER */}
      <div className="mt-8 space-y-3">

        {/* THEME BUTTON */}
        <button
          onClick={toggleTheme}
          className="
            flex items-center gap-3

            w-full

            px-3 py-2.5

            rounded-lg

            text-sm

            text-gray-600
            dark:text-[#9ca3af]

            border
            border-gray-200
            dark:border-[#2a2a2a]

            hover:bg-gray-100
            dark:hover:bg-[#1c1c1c]

            hover:text-gray-900
            dark:hover:text-[#e5e5e5]

            transition-all
            duration-200
          "
        >

          {darkMode ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}

          {darkMode
            ? "Light Mode"
            : "Dark Mode"}

        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="
            flex items-center gap-3

            w-full

            px-3 py-2.5

            rounded-lg

            text-sm

            text-gray-600
            dark:text-[#9ca3af]

            border
            border-gray-200
            dark:border-[#2a2a2a]

            hover:bg-gray-100
            dark:hover:bg-[#1c1c1c]

            hover:text-gray-900
            dark:hover:text-[#e5e5e5]

            transition-all
            duration-200
          "
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </div>
  );
}