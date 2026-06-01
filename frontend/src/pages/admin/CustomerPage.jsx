
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function CustomersPage() {

  // STATES
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [loading, setLoading] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 5;

  // FETCH ALL CUSTOMERS
  const fetchCustomers = async () => {

    try {

      setLoading(true);

      const response = await api.get(
        "/customers/listcustomers/"
      );

      setCustomers(response.data);

    } catch (error) {

      toast.error("Failed to load customers");

    } finally {

      setLoading(false);

    }
  };

  // SEARCH CUSTOMERS
  const searchCustomers = async () => {

    // IF SEARCH EMPTY -> LOAD ALL
    if (search === "") {
      fetchCustomers();
      return;
    }

    try {

      setLoading(true);

      const response = await api.get(
        `/customers/search/?search=${search}`
      );

      setCustomers(response.data);

      setCurrentPage(1);

    } catch (error) {

      toast.error("Search failed");

    } finally {

      setLoading(false);

    }
  };

  // SYNC CUSTOMERS
  const syncCustomers = async () => {

    if (sheetId === "") {
      toast.error("Enter Sheet ID");
      return;
    }

    try {

      setLoading(true);

      const response = await api.post(
        "/customers/sync/",
        {
          sheet_id: sheetId
        }
      );

      toast.success(response.data.message);

      // REFRESH TABLE
      await fetchCustomers();

      // CLEAR INPUT
      setSheetId("");

      // RESET PAGE
      setCurrentPage(1);

    } catch (error) {

      toast.error(
        error.response?.data?.error ||
        "Sync failed"
      );

    } finally {

      setLoading(false);

    }
  };

  // ENTER KEY SEARCH
  const handleKeyDown = (e) => {

    if (e.key === "Enter") {
      searchCustomers();
    }
  };



  // PAGINATION LOGIC
  const lastIndex =
    currentPage * customersPerPage;

  const firstIndex =
    lastIndex - customersPerPage;

  const currentCustomers =
    customers.slice(firstIndex, lastIndex);

  const totalPages =
    Math.ceil(customers.length / customersPerPage);

  return (

    <div className="p-6 bg-white min-h-screen">

      <h1 className="text-2xl font-bold mb-5">
        Customers
      </h1>

      {/* SEARCH */}
      <div className="flex gap-3 mb-4">

        <input
          type="text"
          placeholder="Search customer"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={searchCustomers}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Search
        </button>

      </div>

      {/* SYNC */}
      <div className="flex gap-3 mb-5">

        <input
          type="text"
          placeholder="Enter Google Sheet ID"
          value={sheetId}
          onChange={(e) =>
            setSheetId(e.target.value)
          }
          className="border px-3 py-2 rounded w-full"
        />

        <button
          onClick={syncCustomers}
          className="bg-black text-white px-4 rounded"
        >
          Sync
        </button>
        <button
          onClick={fetchCustomers}
          className="bg-black text-white px-4 rounded"
        >
        Show old Customers
        </button>

      </div>

      {/* TABLE */}
      <div className="border rounded overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="text-left p-3">
                P_ID
              </th>

              <th className="text-left p-3">
                Name
              </th>

              <th className="text-left p-3">
                Mobile
              </th>

              <th className="text-left p-3">
                Amount
              </th>

              <th className="text-left p-3">
                Due Date
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-5"
                >
                  Loading...
                </td>

              </tr>

            ) : currentCustomers.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-5"
                >
                  No customers found
                </td>

              </tr>

            ) : (

              currentCustomers.map((customer) => (

                <tr
                  key={customer.p_id}
                  className="border-t"
                >

                  <td className="p-3">
                    {customer.p_id}
                  </td>

                  <td className="p-3">
                    {customer.cust_name}
                  </td>

                  <td className="p-3">
                    {customer.mobile_number}
                  </td>

                  <td className="p-3">
                    {customer.amount}
                  </td>

                  <td className="p-3">
                    {customer.due_date}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="flex justify-end gap-3 mt-5">

        <button
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="border px-3 py-1 rounded"
        >
          Prev
        </button>

        <span>
          {currentPage} / {totalPages || 1}
        </span>

        <button
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          className="border px-3 py-1 rounded"
        >
          Next
        </button>

      </div>

    </div>
  );
}
