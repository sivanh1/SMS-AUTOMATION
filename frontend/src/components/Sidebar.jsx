import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardList,
  LogOut,
  Send,
  UserCircle,
  Plus,
} from "lucide-react";

export default function Sidebar() {

  const role =
    localStorage.getItem("role");

  const username =
    localStorage.getItem("username");

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const handleLogout = () => {

    localStorage.clear();

    navigate("/");

  };

  const navClass = (active) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
      active
        ? "bg-blue-100 text-blue-700"
        : "text-gray-700 hover:bg-blue-50"
    }`;

  return (

    <div className="w-56 min-h-screen bg-[#f0f7ff] border-r border-gray-200 p-4">

      {/* LOGO */}

      <div className="mb-6">

        <h1 className="text-xl font-semibold text-gray-800">
          SMS
        </h1>

        <p className="text-sm text-gray-500">
          Automation System
        </p>

      </div>

      {/* USER */}

      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-md p-3 mb-6">

        <UserCircle
          size={30}
          className="text-gray-500"
        />

        <div>

          <p className="text-sm font-medium text-gray-800">
            {username}
          </p>

          <p className="text-xs text-gray-500 capitalize">
            {role}
          </p>

        </div>

      </div>

      {/* ADMIN */}

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

      {/* OPERATOR */}

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

        </div>

      )}

      {/* LOGOUT */}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 mt-6 w-full px-3 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-blue-50 transition"
      >

        <LogOut size={18} />

        Logout

      </button>

    </div>

  );
}