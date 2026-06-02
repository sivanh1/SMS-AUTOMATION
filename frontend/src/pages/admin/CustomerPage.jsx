import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 5;

  // Fetch Customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/customers/listcustomers/");
      setCustomers(res.data);

    } catch (err) {
      toast.error("Unable to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  // Search
  const searchCustomers = async () => {

    if (!search.trim()) {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(
        `/customers/search/?search=${search}`
      );

      setCustomers(res.data);
      setCurrentPage(1);

    } catch (err) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Sync
  const syncCustomers = async () => {

    if (!sheetId.trim()) {
      toast.error("Please enter sheet ID");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/customers/sync/", {
        sheet_id: sheetId,
      });

      toast.success(res.data.message);

      await fetchCustomers();

      setSheetId("");
      setCurrentPage(1);

    } catch (err) {
      toast.error(
        err.response?.data?.error || "Sync failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const lastIndex = currentPage * customersPerPage;
  const firstIndex = lastIndex - customersPerPage;

  const currentCustomers = customers.slice(
    firstIndex,
    lastIndex
  );

  const totalPages = Math.ceil(
    customers.length / customersPerPage
  );

  // Enter Search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchCustomers();
    }
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
      <div className="mb-8">

        <h1
          className="
        text-3xl
        font-semibold

        text-gray-800
        dark:text-[#e5e5e5]
      "
        >
          Customers
        </h1>

        <p
          className="
        text-sm
        mt-1

        text-gray-500
        dark:text-[#9ca3af]
      "
        >
          Manage your customer records
        </p>

      </div>

      {/* Search + Actions */}
      <div
        className="
      bg-white
      dark:bg-[#181818]

      border
      border-gray-200
      dark:border-[#2a2a2a]

      rounded-xl
      p-4
      mb-6

      transition-colors
      duration-300
    "
      >

        <div className="flex flex-col md:flex-row gap-3">

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
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

          <button
            onClick={searchCustomers}
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
            Search
          </button>

        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-4">

          <input
            type="text"
            placeholder="Google Sheet ID"
            value={sheetId}
            onChange={(e) => setSheetId(e.target.value)}
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

          <button
            onClick={syncCustomers}
            className="
          px-5 py-2

          rounded-lg

          border
          border-gray-300
          dark:border-[#2a2a2a]

          bg-white
          dark:bg-[#181818]

          text-gray-700
          dark:text-[#e5e5e5]

          hover:bg-gray-100
          dark:hover:bg-[#1c1c1c]

          transition-colors
        "
          >
            Sync
          </button>

          <button
            onClick={fetchCustomers}
            className="
          px-5 py-2

          rounded-lg

          border
          border-gray-300
          dark:border-[#2a2a2a]

          bg-white
          dark:bg-[#181818]

          text-gray-700
          dark:text-[#e5e5e5]

          hover:bg-gray-100
          dark:hover:bg-[#1c1c1c]

          transition-colors
        "
          >
            Refresh
          </button>

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
            border-b

            bg-gray-50
            dark:bg-[#151515]

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
                  Name
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Mobile
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Amount
                </th>

                <th className="text-left px-6 py-4 font-medium">
                  Due Date
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
                  py-12

                  text-gray-400
                  dark:text-[#9ca3af]
                "
                  >
                    Loading...
                  </td>
                </tr>

              ) : currentCustomers.length === 0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="
                  text-center
                  py-12

                  text-gray-400
                  dark:text-[#9ca3af]
                "
                  >
                    No customers found
                  </td>
                </tr>

              ) : (

                currentCustomers.map((customer) => (

                  <tr
                    key={customer.p_id}
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
                      {customer.p_id}
                    </td>

                    <td
                      className="
                    px-6 py-4
                    font-medium

                    text-gray-800
                    dark:text-[#e5e5e5]
                  "
                    >
                      {customer.cust_name}
                    </td>

                    <td
                      className="
                    px-6 py-4
                    text-sm

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >
                      {customer.mobile_number}
                    </td>

                    <td
                      className="
                    px-6 py-4
                    font-medium

                    text-gray-800
                    dark:text-[#e5e5e5]
                  "
                    >
                      ₹ {customer.amount}
                    </td>

                    <td
                      className="
                    px-6 py-4
                    text-sm

                    text-gray-600
                    dark:text-[#9ca3af]
                  "
                    >
                      {customer.due_date}
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
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
            disabled={currentPage === 1}
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
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
            disabled={
              currentPage === totalPages ||
              totalPages === 0
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