import { useEffect, useState } from "react";
import api from "../../services/api";

// Stateful helper component to contain message truncation and toggles smoothly
const MessageCell = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongMessage = message && message.length > 60;

  return (
    <div className="text-sm max-w-xs text-gray-600 dark:text-[#9ca3af]">
      <p className={isExpanded ? "whitespace-pre-wrap break-words" : "line-clamp-2"}>
        {message}
      </p>
      {isLongMessage && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold mt-1 text-blue-600 dark:text-blue-400 hover:underline focus:outline-none block"
        >
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    customers: 0,
    users: 0,
    templates: 0,
    logs: 0,
    loggedCount: 0,
    failedCount: 0,
  });

  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [customersRes, usersRes, templatesRes, logsRes] = await Promise.all([
        api.get("/customers/listcustomers/"),
        api.get("/users/all/"),
        api.get("/templates/"),
        api.get("/sms/logs/"),
      ]);

      const logs = logsRes.data;
      const loggedCount = logs.filter((log) => log.status === "logged").length;
      const failedCount = logs.filter((log) => log.status === "failed").length;

      setStats({
        customers: customersRes.data.length,
        users: usersRes.data.length,
        templates: templatesRes.data.length,
        logs: logs.length,
        loggedCount,
        failedCount,
      });

      // Isolates the last 5 logs cleanly for your dashboard display preview
      setRecentLogs(logs.slice(0, 5));
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

      {/* STATS GRID */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-5
          mb-8
          items-start
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
            h-32
            flex
            flex-col
            justify-between
            transition-colors
            duration-300
          "
        >
          <p className="text-sm text-gray-500 dark:text-[#9ca3af]">Customers</p>
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-[#e5e5e5]">
            {loading ? "--" : stats.customers}
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
            h-32
            flex
            flex-col
            justify-between
            transition-colors
            duration-300
          "
        >
          <p className="text-sm text-gray-500 dark:text-[#9ca3af]">Users</p>
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-[#e5e5e5]">
            {loading ? "--" : stats.users}
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
            h-32
            flex
            flex-col
            justify-between
            transition-colors
            duration-300
          "
        >
          <p className="text-sm text-gray-500 dark:text-[#9ca3af]">Templates</p>
          <h2 className="text-4xl font-semibold text-gray-900 dark:text-[#e5e5e5]">
            {loading ? "--" : stats.templates}
          </h2>
        </div>

        {/* SMS LOGS BREAKDOWN */}
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
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-500 dark:text-[#9ca3af]">SMS Logs</p>
            <span className="text-2xl font-semibold text-gray-900 dark:text-[#e5e5e5]">
              {loading ? "--" : stats.logs}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#2a2a2a] space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-[#9ca3af]">Logged</p>
              <span
                className="
                  px-2.5 py-0.5
                  rounded-full
                  text-xs
                  font-medium
                  bg-green-100
                  dark:bg-green-950/30
                  text-green-700
                  dark:text-green-400
                "
              >
                {loading ? "--" : stats.loggedCount}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 dark:text-[#9ca3af]">Failed</p>
              <span
                className="
                  px-2.5 py-0.5
                  rounded-full
                  text-xs
                  font-medium
                  bg-red-100
                  dark:bg-red-950/30
                  text-red-600
                  dark:text-red-400
                "
              >
                {loading ? "--" : stats.failedCount}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT LOGS SECTION */}
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

        {/* LOGS TABLE CONTAINER (MATCHES LOGS PAGE EXACTLY) */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead
              className="
                bg-gray-50
                dark:bg-[#151515]
                border-b
                border-gray-200
                dark:border-[#2a2a2a]
              "
            >
              <tr className="text-sm text-gray-600 dark:text-[#9ca3af]">
                <th className="text-left px-6 py-4 font-medium">P_ID</th>
                <th className="text-left px-6 py-4 font-medium">Customer</th>
                <th className="text-left px-6 py-4 font-medium">Mobile</th>
                <th className="text-left px-6 py-4 font-medium">Message</th>
                <th className="text-left px-6 py-4 font-medium">Sent By</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-400 dark:text-[#9ca3af]"
                  >
                    Loading...
                  </td>
                </tr>
              ) : recentLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-gray-400 dark:text-[#9ca3af]"
                  >
                    No logs found
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="
                      hover:bg-gray-50
                      dark:hover:bg-[#1c1c1c]
                      transition-colors
                      duration-150
                    "
                  >
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-[#9ca3af]">
                      {log.p_id}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-[#e5e5e5]">
                      {log.cust_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-[#9ca3af]">
                      {log.mobile_number}
                    </td>

                    <td className="px-6 py-4">
                      <MessageCell message={log.message} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-[#9ca3af]">
                      {log.sent_by?.username || "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`
                          text-xs
                          px-3 py-1
                          rounded-full
                          ${
                            log.status === "failed"
                              ? "bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                              : "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          }
                        `}
                      >
                        {log.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-[#9ca3af]">
                      {new Date(log.created_at).toLocaleDateString()}
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