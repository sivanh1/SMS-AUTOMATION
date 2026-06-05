import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "../../services/api";

export default function LogsPage() {

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  // NEW: Filter State
  const [statusFilter, setStatusFilter] =
    useState("All");

  const logsPerPage = 5;

  const fetchLogs = async () => {

    try {

      const response =
        await api.get("/sms/logs/");

      setLogs(response.data);

    } catch (error) {

      toast.error("Failed");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    fetchLogs();

  }, []);

  // NEW: Helper to dynamically compute status based on scheduled time
  const getDisplayStatus = (log) => {

    if (log.status === "failed") return "Failed";

    if (log.status === "pending" || log.scheduled_time) {

      const now = new Date();

      const scheduled = new Date(log.scheduled_time);

      if (scheduled > now) {

        return "Scheduled";

      } else {

        return "Logged";

      }

    }

    return log.status ? log.status.charAt(0).toUpperCase() + log.status.slice(1) : "Logged";

  };

  // NEW: Filter the logs array before pagination
  const filteredLogs = logs.filter((log) => {

    if (statusFilter === "All") return true;

    return getDisplayStatus(log).toLowerCase() === statusFilter.toLowerCase();

  });

  const indexOfLastLog =
    currentPage * logsPerPage;

  const indexOfFirstLog =
    indexOfLastLog - logsPerPage;

  // CHANGED: Slice from filteredLogs instead of logs
  const currentLogs =
    filteredLogs.slice(
      indexOfFirstLog,
      indexOfLastLog
    );

  // CHANGED: Calculate total pages from filteredLogs
  const totalPages = Math.ceil(
    filteredLogs.length / logsPerPage
  );

  const MessageCell = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Approximating length restriction. Adjust 60 characters to your preferred threshold.
  const isLongMessage = message && message.length > 60; 

  return (
    <div className="text-sm max-w-xs text-gray-600 dark:text-[#9ca3af]">
      <p className={isExpanded ? "" : "line-clamp-2"}>
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
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1
            className="
          text-3xl
          font-semibold

          text-gray-800
          dark:text-[#e5e5e5]
        "
          >
            SMS Logs
          </h1>

          <p
            className="
          text-sm
          mt-1

          text-gray-500
          dark:text-[#9ca3af]
        "
          >
            View all sent SMS history
          </p>

        </div>

        {/* NEW: Filter Dropdown */}
        <div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="
              px-4 py-2

              rounded-lg
              outline-none

              border
              border-gray-200
              dark:border-[#2a2a2a]

              bg-white
              dark:bg-[#151515]

              text-sm
              text-gray-800
              dark:text-[#e5e5e5]

              focus:border-gray-400
              dark:focus:border-[#3a3a3a]

              transition-colors
            "
          >

            <option value="All">All Statuses</option>

            <option value="Logged">Logged</option>

            <option value="Failed">Failed</option>

            <option value="Scheduled">Scheduled</option>

          </select>

        </div>

      </div>

      {/* Table */}
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
                  P_ID
                </th>

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
                  Status
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
                    colSpan="7"
                    className="
                  text-center
                  py-10

                  text-gray-400
                  dark:text-[#9ca3af]
                "
                  >
                    Loading logs...
                  </td>

                </tr>

              ) : filteredLogs.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="
                  text-center
                  py-10

                  text-gray-400
                  dark:text-[#9ca3af]
                "
                  >
                    No logs found
                  </td>

                </tr>

              ) : (

                currentLogs.map((log) => (

                  <tr
                    key={log.id}
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
                    text-sm

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >
                      {log.p_id}
                    </td>

                    <td
                      className="
                    px-6 py-4
                    font-medium

                    text-gray-800
                    dark:text-[#e5e5e5]
                  "
                    >
                      {log.cust_name}
                    </td>

                    <td
                      className="
                    px-6 py-4
                    text-sm

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >
                      {log.mobile_number}
                    </td>

                    <td className="px-6 py-4">
  <MessageCell message={log.message} />
</td>

                    <td
                      className="
                    px-6 py-4
                    text-sm

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >
                      {log.sent_by?.username}
                    </td>

                    <td className="px-6 py-4">

                      <div className="flex flex-col items-start gap-1">
                        <span
    className={`
      text-xs

      px-3 py-1

      rounded-full

      w-fit

      ${
        getDisplayStatus(log) === "Failed"

          ? `
            bg-red-100
            dark:bg-red-950/30

            text-red-600
            dark:text-red-400
          `

          : getDisplayStatus(log) === "Scheduled"

          ? `
            bg-blue-100
            dark:bg-blue-950/30

            text-blue-600
            dark:text-blue-400
          `

          : `
            bg-green-100
            dark:bg-green-950/30

            text-green-700
            dark:text-green-400
          `
      }
    `}
  >
    {getDisplayStatus(log)}
  </span>
  
                        {getDisplayStatus(log) === "Scheduled" && log.scheduled_time && (
                          <span className="text-[11px] text-gray-500 dark:text-[#9ca3af] mt-1 whitespace-nowrap">
                            {new Date(log.scheduled_time).toLocaleString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        )}
                      </div>

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

      {/* Pagination */}
      <div className="flex items-center justify-between mt-5">

        <p
          className="
        text-sm

        text-gray-500
        dark:text-[#9ca3af]
      "
        >
          {currentPage} / {totalPages || 1}
        </p>

        <div className="flex gap-2">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
            className="
          px-4 py-2

          rounded-lg
          text-sm

          border
          border-gray-300
          dark:border-[#2a2a2a]

          bg-white
          dark:bg-[#181818]

          text-gray-700
          dark:text-[#e5e5e5]

          hover:bg-gray-100
          dark:hover:bg-[#1c1c1c]

          disabled:opacity-50

          transition-colors
        "
          >
            Prev
          </button>

          <button
            disabled={currentPage >= totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
            className="
          px-4 py-2

          rounded-lg
          text-sm

          border
          border-gray-300
          dark:border-[#2a2a2a]

          bg-white
          dark:bg-[#181818]

          text-gray-700
          dark:text-[#e5e5e5]

          hover:bg-gray-100
          dark:hover:bg-[#1c1c1c]

          disabled:opacity-50

          transition-colors
        "
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
}