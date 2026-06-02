import { useEffect, useState } from "react";

import api from "../../services/api";

export default function DashboardPage() {

  const [stats, setStats] = useState({
    customers: 0,
    users: 0,
    templates: 0,
    logs: 0,
  });

  const [recentLogs, setRecentLogs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const fetchDashboard = async () => {

    try {

      const [
        customersRes,
        usersRes,
        templatesRes,
        logsRes,
      ] = await Promise.all([
        api.get("/customers/listcustomers/"),
        api.get("/users/all/"),
        api.get("/templates/"),
        api.get("/sms/logs/"),
      ]);

      setStats({
        customers:
          customersRes.data.length,

        users:
          usersRes.data.length,

        templates:
          templatesRes.data.length,

        logs:
          logsRes.data.length,
      });

      setRecentLogs(
        logsRes.data.slice(0, 5)
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchDashboard();

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

    {/* HEADER */}
    <div className="mb-8">

      <h1
        className="
          text-3xl
          font-semibold

          text-gray-900
          dark:text-[#e5e5e5]
        "
      >
        Dashboard
      </h1>

      <p
        className="
          text-sm
          mt-1

          text-gray-500
          dark:text-[#9ca3af]
        "
      >
        Overview of your system
      </p>

    </div>

    {/* STATS */}
    <div
      className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-4

        gap-5
        mb-8
      "
    >

      {/* CUSTOMERS */}
      <div
        className="
          bg-white
          dark:bg-[#181818]

          border
          border-gray-200
          dark:border-[#2a2a2a]

          rounded-xl

          p-5

          transition-colors
          duration-300
        "
      >

        <p
          className="
            text-sm

            text-gray-500
            dark:text-[#9ca3af]
          "
        >
          Customers
        </p>

        <h2
          className="
            text-4xl
            font-semibold

            mt-3

            text-gray-900
            dark:text-[#e5e5e5]
          "
        >

          {loading
            ? "--"
            : stats.customers}

        </h2>

      </div>

      {/* USERS */}
      <div
        className="
          bg-white
          dark:bg-[#181818]

          border
          border-gray-200
          dark:border-[#2a2a2a]

          rounded-xl

          p-5

          transition-colors
          duration-300
        "
      >

        <p
          className="
            text-sm

            text-gray-500
            dark:text-[#9ca3af]
          "
        >
          Users
        </p>

        <h2
          className="
            text-4xl
            font-semibold

            mt-3

            text-gray-900
            dark:text-[#e5e5e5]
          "
        >

          {loading
            ? "--"
            : stats.users}

        </h2>

      </div>

      {/* TEMPLATES */}
      <div
        className="
          bg-white
          dark:bg-[#181818]

          border
          border-gray-200
          dark:border-[#2a2a2a]

          rounded-xl

          p-5

          transition-colors
          duration-300
        "
      >

        <p
          className="
            text-sm

            text-gray-500
            dark:text-[#9ca3af]
          "
        >
          Templates
        </p>

        <h2
          className="
            text-4xl
            font-semibold

            mt-3

            text-gray-900
            dark:text-[#e5e5e5]
          "
        >

          {loading
            ? "--"
            : stats.templates}

        </h2>

      </div>

      {/* LOGS */}
      <div
        className="
          bg-white
          dark:bg-[#181818]

          border
          border-gray-200
          dark:border-[#2a2a2a]

          rounded-xl

          p-5

          transition-colors
          duration-300
        "
      >

        <p
          className="
            text-sm

            text-gray-500
            dark:text-[#9ca3af]
          "
        >
          SMS Logs
        </p>

        <h2
          className="
            text-4xl
            font-semibold

            mt-3

            text-gray-900
            dark:text-[#e5e5e5]
          "
        >

          {loading
            ? "--"
            : stats.logs}

        </h2>

      </div>

    </div>

    {/* RECENT LOGS */}
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

      {/* TOP */}
      <div
        className="
          px-6 py-4

          border-b
          border-gray-200
          dark:border-[#2a2a2a]
        "
      >

        <h2
          className="
            text-lg
            font-medium

            text-gray-900
            dark:text-[#e5e5e5]
          "
        >
          Recent SMS Logs
        </h2>

      </div>

      {/* TABLE */}
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

                text-gray-500
                dark:text-[#9ca3af]
              "
            >

              <th className="text-left px-6 py-4 font-medium">
                Customer
              </th>

              <th className="text-left px-6 py-4 font-medium">
                Mobile
              </th>

              <th className="text-left px-6 py-4 font-medium">
                Message
              </th>

              <th className="text-left px-6 py-4 font-medium">
                Sent By
              </th>

              <th className="text-left px-6 py-4 font-medium">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="5"
                  className="
                    text-center
                    py-10

                    text-gray-500
                    dark:text-[#9ca3af]
                  "
                >
                  Loading...
                </td>

              </tr>

            ) : recentLogs.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="
                    text-center
                    py-10

                    text-gray-500
                    dark:text-[#9ca3af]
                  "
                >
                  No logs found
                </td>

              </tr>

            ) : (

              recentLogs.map((log) => (

                <tr
                  key={log.id}
                  className="
                    border-b
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

                      text-gray-900
                      dark:text-[#e5e5e5]
                    "
                  >
                    {log.customer?.cust_name}
                  </td>

                  <td
                    className="
                      px-6 py-4

                      text-gray-500
                      dark:text-[#9ca3af]
                    "
                  >
                    {log.customer?.mobile_number}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className="
                        px-3 py-1

                        text-xs

                        rounded-full

                        bg-gray-100
                        dark:bg-[#222222]

                        text-gray-700
                        dark:text-[#e5e5e5]
                      "
                    >
                      {log.message}
                    </span>

                  </td>

                  <td
                    className="
                      px-6 py-4

                      text-gray-500
                      dark:text-[#9ca3af]
                    "
                  >
                    {log.sent_by?.username}
                  </td>

                  <td
                    className="
                      px-6 py-4

                      text-gray-500
                      dark:text-[#9ca3af]
                    "
                  >

                    {new Date(
                      log.created_at
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