import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "../../services/api";

export default function UsersPage() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("operator");

  const fetchUsers = async () => {

    try {

      const response =
        await api.get("/users/all/");

      setUsers(response.data);

    } catch (error) {

      toast.error("Failed");

    } finally {

      setLoading(false);

    }
  };

  const handleCreateUser = async () => {

    if (!username || !password) {

      toast.error("Enter all fields");

      return;
    }

    try {

      const response =
        await api.post(
          "/users/create/",
          {
            username,
            password,
            role,
          }
        );

      toast.success(
        response.data.message
      );

      setUsername("");

      setPassword("");

      setRole("operator");

      fetchUsers();

    } catch (error) {

      toast.error(
        error.response?.data?.error ||
        "Error"
      );

    }
  };

  useEffect(() => {

    fetchUsers();

  }, []);

  return (

    <div
      className="
    min-h-screen

    bg-gray-50
    dark:bg-[#0f0f0f]

    p-6

    transition-colors
    duration-300
  "
    >

      {/* Header */}
      <div className="mb-8">

        <h1
          className="
        text-3xl
        font-semibold

        text-gray-800
        dark:text-[#e5e5e5]
      "
        >
          Users
        </h1>

        <p
          className="
        text-sm
        mt-1

        text-gray-500
        dark:text-[#9ca3af]
      "
        >
          Manage system users and roles
        </p>

      </div>

      {/* Create User */}
      <div
        className="
      bg-white
      dark:bg-[#181818]

      border
      border-gray-200
      dark:border-[#2a2a2a]

      rounded-xl

      p-5
      mb-6

      transition-colors
      duration-300
    "
      >

        <h2
          className="
        text-lg
        font-medium
        mb-4

        text-gray-800
        dark:text-[#e5e5e5]
      "
        >
          Create User
        </h2>

        <div className="flex flex-col md:flex-row gap-3">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className="
          flex-1

          px-4 py-2

          rounded-lg
          outline-none

          border
          border-gray-200
          dark:border-[#2a2a2a]

          bg-white
          dark:bg-[#151515]

          text-gray-800
          dark:text-[#e5e5e5]

          placeholder:text-gray-400
          dark:placeholder:text-[#6b7280]

          focus:border-gray-400
          dark:focus:border-[#3a3a3a]

          transition-colors
        "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="
          flex-1

          px-4 py-2

          rounded-lg
          outline-none

          border
          border-gray-200
          dark:border-[#2a2a2a]

          bg-white
          dark:bg-[#151515]

          text-gray-800
          dark:text-[#e5e5e5]

          placeholder:text-gray-400
          dark:placeholder:text-[#6b7280]

          focus:border-gray-400
          dark:focus:border-[#3a3a3a]

          transition-colors
        "
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
            className="
          px-4 py-2

          rounded-lg
          outline-none

          border
          border-gray-200
          dark:border-[#2a2a2a]

          bg-white
          dark:bg-[#151515]

          text-gray-800
          dark:text-[#e5e5e5]

          focus:border-gray-400
          dark:focus:border-[#3a3a3a]

          transition-colors
        "
          >

            <option value="operator">
              Operator
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

          <button
            onClick={handleCreateUser}
            className="
          px-5 py-2

          rounded-lg

          bg-gray-900
          dark:bg-[#222222]

          text-white
          dark:text-[#e5e5e5]

          hover:bg-black
          dark:hover:bg-[#2a2a2a]

          transition-colors
        "
          >
            Create
          </button>

        </div>

      </div>

      {/* Users Table */}
      <div
        className="
      bg-white
      dark:bg-[#181818]

      border
      border-gray-200
      dark:border-[#2a2a2a]

      rounded-xl
      overflow-hidden

      transition-colors
      duration-300
    "
      >

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead
              className="
            bg-gray-50
            dark:bg-[#151515]

            border-b
            border-gray-200
            dark:border-[#2a2a2a]
          "
            >

              <tr
                className="
              text-sm

              text-gray-600
              dark:text-[#9ca3af]
            "
              >

                <th className="text-left px-6 py-4 font-medium">
                  Username
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Role
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Superuser
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Joined
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="4"
                    className="
                  text-center
                  py-10

                  text-gray-400
                  dark:text-[#9ca3af]
                "
                  >
                    Loading users...
                  </td>

                </tr>

              ) : users.length === 0 ? (

                <tr>

                  <td
                    colSpan="4"
                    className="
                  text-center
                  py-10

                  text-gray-400
                  dark:text-[#9ca3af]
                "
                  >
                    No users found
                  </td>

                </tr>

              ) : (

                users.map((user) => (

                  <tr
                    key={user.id}
                    className="
                  border-b
                  last:border-none

                  border-gray-200
                  dark:border-[#2a2a2a]

                  hover:bg-gray-50
                  dark:hover:bg-[#1c1c1c]

                  transition-colors
                "
                  >

                    <td
                      className="
                    px-6 py-4
                    font-medium

                    text-gray-800
                    dark:text-[#e5e5e5]
                  "
                    >
                      {user.username}
                    </td>

                    <td
                      className="
                    px-6 py-4
                    text-sm

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >
                      {user.role}
                    </td>

                    <td
                      className="
                    px-6 py-4
                    text-sm

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >

                      {user.is_superuser
                        ? "Yes"
                        : "No"}

                    </td>

                    <td
                      className="
                    px-6 py-4
                    text-sm

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >

                      {new Date(
                        user.date_joined
                      ).toLocaleDateString()}

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}