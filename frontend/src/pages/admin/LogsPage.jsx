import { useEffect, useState } from "react";

import toast from "react-hot-toast";

import api from "../../services/api";

export default function LogsPage() {

  const [logs, setLogs] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

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

  const indexOfLastLog =
    currentPage * logsPerPage;

  const indexOfFirstLog =
    indexOfLastLog - logsPerPage;

  const currentLogs =
    logs.slice(
      indexOfFirstLog,
      indexOfLastLog
    );

  const totalPages = Math.ceil(
    logs.length / logsPerPage
  );

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

              ) : logs.length === 0 ? (

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

                    <td
                      className="
                    px-6 py-4
                    text-sm
                    max-w-xs

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >
                      <p className="line-clamp-2">
                        {log.message}
                      </p>
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

                      <span
                        className="
                      text-xs

                      px-3 py-1

                      rounded-full

                      bg-gray-100
                      dark:bg-[#222222]

                      text-gray-700
                      dark:text-[#e5e5e5]
                    "
                      >
                        {log.status}
                      </span>

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