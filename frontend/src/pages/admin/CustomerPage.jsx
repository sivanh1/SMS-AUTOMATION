import { useEffect, useState } from "react";

import api from "../../services/api";

import XLSXUpload from "../../components/XLSXUpload";

export default function CustomersPage() {

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchError, setSearchError] = useState("");
  const [sheetError, setSheetError] = useState("");
  const [file, setFile] = useState(null);



  const customersPerPage = 5;



  // Fetch Customers
  const fetchCustomers = async () => {

    setErrorMessage("");

    try {

      setLoading(true);

      const res =
        await api.get(
          "/customers/listcustomers/"
        );

      setCustomers(res.data);

    } catch (error) {

      console.log(
        "Fetch Customers Error:",
        error.response?.data
      );

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "Unable to fetch customers"
      );

    } finally {

      setLoading(false);
    }
  };



  // Search Customers
  const searchCustomers = async () => {

    setErrorMessage("");
    setSearchError("");
    setSuccessMessage("");

    if (!search.trim()) {

      setSearchError(
        "Search field cannot be blank"
      );

      return;
    }

    try {

      setLoading(true);

      const res = await api.get(
        `/customers/search/?search=${search}`
      );

      // ✅ Exact P_ID result
      if (!res.data || res.data.length === 0) {

        setCustomers([]);

        setErrorMessage("No customer found");

      } else {

        // if API returns single object
        const customerData = Array.isArray(res.data)
          ? res.data
          : [res.data];

        setCustomers(customerData);

        setCurrentPage(1);

        setSuccessMessage(
          "Customer searched successfully"
        );

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }

    } catch (error) {

      console.log(
        "Search Error:",
        error.response?.data
      );

      setCustomers([]);

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "No customer found"
      );

    } finally {

      setLoading(false);
    }
  };




  // Sync Customers
  const syncCustomers = async () => {

    setErrorMessage("");
    setSheetError("");

    if (!sheetId.trim()) {

      setSheetError(
        "Google Sheet ID cannot be blank"
      );

      return;
    }

    try {

      setLoading(true);

      const res = await api.post(
        "/customers/sync/",
        {
          sheet_id: sheetId,
        }
      );

      setSuccessMessage(
        res.data.message
      );

      await fetchCustomers();

      setSheetId("");

      setCurrentPage(1);

      setTimeout(() => {

        setSuccessMessage("");

      }, 4000);

    } catch (error) {

  console.log("Full Error:", error);

  setCustomers([]);

  
  if (
    error.response?.status === 404 ||
    String(error.response?.data).includes("404")
  ) {

    setErrorMessage("Check Sheet ID");

  } else {

    setErrorMessage(

      error.response?.data?.error ||

      error.response?.data?.detail ||

      error.message ||

      "Sync failed"
    );
  }

} finally {

  setLoading(false);
}
  };
  // IMPORT XLSX


  // Pagination
  const lastIndex =
    currentPage * customersPerPage;

  const firstIndex =
    lastIndex - customersPerPage;

  const currentCustomers =
    customers.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
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



      {/* Success Message */}
      {successMessage && (

        <div
          className="
            mb-5
            px-4 py-3

            rounded-xl
            text-sm

            border
            border-green-200
            dark:border-green-900/30

            bg-green-50
            dark:bg-green-950/20

            text-green-700
            dark:text-green-400

            transition-colors
          "
        >
          {successMessage}
        </div>
      )}



      {/* Error Message */}
      {errorMessage && (

        <div
          className="
            mb-5
            px-4 py-3

            rounded-xl
            text-sm

            border
            border-red-200
            dark:border-red-900/30

            bg-red-50
            dark:bg-red-950/20

            text-red-700
            dark:text-red-400

            transition-colors
          "
        >
          {errorMessage}
        </div>
      )}



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

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-3">

          <div className="flex-1">

            <input
              type="text"

              placeholder="Search customer..."

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              onKeyDown={handleKeyDown}

              className="
                w-full

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

            {searchError && (

              <p
                className="
                  mt-2

                  text-sm

                  text-red-500
                  dark:text-red-400
                "
              >
                {searchError}
              </p>
            )}

          </div>



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



        {/* Sync */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">

          <div className="flex-1">

            <input
              type="text"

              placeholder="Google Sheet ID"

              value={sheetId}

              onChange={(e) =>
                setSheetId(
                  e.target.value
                )
              }

              className="
                w-full

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

            {sheetError && (

              <p
                className="
                  mt-2

                  text-sm

                  text-red-500
                  dark:text-red-400
                "
              >
                {sheetError}
              </p>
            )}

          </div>



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
        <XLSXUpload
  fetchCustomers={fetchCustomers}
/>

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
                      {customer.amount}
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