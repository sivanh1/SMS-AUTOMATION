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

    <div className="p-6 bg-white min-h-screen">

      <h1 className="text-2xl font-semibold mb-6">
        SMS Logs
      </h1>

      {/* TABLE */}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                P_ID
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Customer
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Mobile
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Message
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Sent By
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Status
              </th>

              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-6"
                >
                  Loading...
                </td>

              </tr>

            ) : logs.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center py-6"
                >
                  No logs found
                </td>

              </tr>

            ) : (

              currentLogs.map((log) => (

                <tr
                  key={log.id}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-4 py-3 text-gray-700">
                    {log.customer?.p_id}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {log.customer?.cust_name}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {log.customer?.mobile_number}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {log.message}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {log.sent_by?.username}
                  </td>

                  <td className="px-4 py-3 text-gray-700">
                    {log.status}
                  </td>

                  <td className="px-4 py-3 text-gray-700">

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

      {/* Pagination */}

      <div className="flex justify-end items-center gap-3 mt-4">

        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
          className="border border-gray-300 px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm text-gray-600">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
          className="border border-gray-300 px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}