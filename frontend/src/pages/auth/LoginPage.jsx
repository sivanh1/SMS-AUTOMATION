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

  <div
    className="
      min-h-screen

      bg-gray-100
      dark:bg-[#0f0f0f]

      flex items-center justify-center

      px-4

      transition-colors
      duration-300
    "
  >

    <div
      className="
        w-full
        max-w-4xl

        bg-white
        dark:bg-[#181818]

        border
        border-gray-200
        dark:border-[#2a2a2a]

        rounded-2xl

        overflow-hidden

        grid
        grid-cols-1
        md:grid-cols-2

        transition-colors
        duration-300
      "
    >

      {/* Left Side */}
      <div
        className="
          hidden
          md:flex

          items-center
          justify-center

          bg-gray-50
          dark:bg-[#151515]

          p-8

          border-r
          border-gray-200
          dark:border-[#2a2a2a]

          transition-colors
          duration-300
        "
      >

        <img
          src={login}
          alt="login"
          className="
            w-full
            max-w-sm

            opacity-90
          "
        />

      </div>

      {/* Right Side */}
      <div className="flex items-center justify-center p-8">

        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="mb-6">

            <h1
              className="
                text-3xl
                font-semibold

                text-gray-900
                dark:text-[#e5e5e5]
              "
            >
              Login
            </h1>

            <p
              className="
                text-sm
                mt-1

                text-gray-500
                dark:text-[#9ca3af]
              "
            >
              Sign in to your account
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Username */}
            <div>

              <label
                className="
                  block
                  text-sm
                  mb-2

                  text-gray-700
                  dark:text-[#9ca3af]
                "
              >
                Username
              </label>

              <input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                className="
                  w-full

                  px-4 py-2.5

                  rounded-lg
                  outline-none

                  border
                  border-gray-300
                  dark:border-[#2a2a2a]

                  bg-white
                  dark:bg-[#151515]

                  text-gray-900
                  dark:text-[#e5e5e5]

                  placeholder:text-gray-400
                  dark:placeholder:text-[#6b7280]

                  focus:border-gray-400
                  dark:focus:border-[#3a3a3a]

                  transition-colors
                "
              />

            </div>

            {/* Password */}
            <div>

              <label
                className="
                  block
                  text-sm
                  mb-2

                  text-gray-700
                  dark:text-[#9ca3af]
                "
              >
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="
                  w-full

                  px-4 py-2.5

                  rounded-lg
                  outline-none

                  border
                  border-gray-300
                  dark:border-[#2a2a2a]

                  bg-white
                  dark:bg-[#151515]

                  text-gray-900
                  dark:text-[#e5e5e5]

                  placeholder:text-gray-400
                  dark:placeholder:text-[#6b7280]

                  focus:border-gray-400
                  dark:focus:border-[#3a3a3a]

                  transition-colors
                "
              />

              {errorMessage && (

                <p
                  className="
                    text-sm
                    mt-2

                    text-red-500
                  "
                >
                  {errorMessage}
                </p>

              )}

            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full

                py-2.5

                rounded-lg

                bg-gray-900
                dark:bg-[#222222]

                text-white
                dark:text-[#e5e5e5]

                font-medium
                text-sm

                hover:bg-black
                dark:hover:bg-[#2a2a2a]

                disabled:opacity-50

                transition-colors
              "
            >

              {loading
                ? "Signing in..."
                : "Login"}

            </button>

          </form>

        </div>

      </div>

    </div>

  </div>

);
}