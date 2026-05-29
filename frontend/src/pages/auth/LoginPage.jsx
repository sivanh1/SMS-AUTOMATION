import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import login from "../../assets/login.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");

    if (!username.trim()) {
      setErrorMessage("Username is required");
      return;
    }

    if (!password.trim()) {
      setErrorMessage("Password is required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/users/login/", {
        username: username.trim(),
        password: password.trim(),
      });

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      localStorage.setItem(
        "refresh_token",
        response.data.refresh_token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      toast.success("Login successful");

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/operator");
      }

    } catch (error) {

      setErrorMessage(
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Incorrect username or password"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* Left Side */}
        <div className="hidden md:flex items-center justify-center bg-gray-50 p-8">

          <img
            src={login}
            alt="login"
            className="w-full max-w-sm"
          />

        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center p-8">

          <div className="w-full max-w-sm">

            <div className="mb-6">

              <h1 className="text-2xl font-semibold text-gray-900">
                Login
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Sign in to your account
              </p>

            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username */}
              <div>

                <label className="block text-sm text-gray-700 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

              </div>

              {/* Password */}
              <div>

                <label className="block text-sm text-gray-700 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                />

                {errorMessage && (
                  <p className="text-red-500 text-sm mt-2">
                    {errorMessage}
                  </p>
                )}

              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-md transition disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Login"}
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}