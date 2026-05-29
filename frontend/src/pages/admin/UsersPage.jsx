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

    <div className="p-6 bg-white min-h-screen">

      <h1 className="text-2xl font-semibold mb-6">
        Users
      </h1>

      {/* FORM */}

      <div className="flex gap-3 mb-6 flex-wrap">

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="border border-gray-300 px-3 py-2 rounded text-sm"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="border border-gray-300 px-3 py-2 rounded text-sm"
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          className="border border-gray-300 px-3 py-2 rounded text-sm"
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
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Create
        </button>

      </div>

      {/* TABLE */}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Username
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Role
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Superuser
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Joined
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="4"
                  className="text-center py-6"
                >
                  Loading...
                </td>

              </tr>

            ) : users.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="text-center py-6"
                >
                  No users found
                </td>

              </tr>

            ) : (

              users.map((user) => (

                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-4 py-3 text-gray-700">
                    {user.username}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {user.role}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {user.is_superuser
                      ? "Yes"
                      : "No"}
                  </td>

                  <td className="px-4 py-3 text-gray-700">

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
  );
}