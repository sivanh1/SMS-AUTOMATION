import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sheetId, setSheetId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 5;

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/customers/listcustomers/"
      );

      setCustomers(response.data);

    } catch (error) {

      toast.error("Failed to fetch customers");

    } finally {

      setLoading(false);

    }
  };

  const handleSearch = async () => {
    if (search.trim() === "") {
      fetchCustomers();
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        `/customers/search/?search=${search}`
      );

      setCustomers(response.data);

    } catch (error) {

      toast.error("Search failed");

    } finally {

      setLoading(false);

    }
  };

  const handleSync = async () => {
    if (!sheetId) {
      toast.error("Please enter Sheet ID");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/customers/sync/",
        { sheet_id: sheetId }
      );

      toast.success(response.data.message);

      fetchCustomers();

      setSheetId("");

    } catch (error) {

      toast.error("Customer sync failed");

    } finally {

      setLoading(false);

    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const indexOfLastCustomer =
    currentPage * customersPerPage;

  const indexOfFirstCustomer =
    indexOfLastCustomer - customersPerPage;

  const currentCustomers =
    customers.slice(
      indexOfFirstCustomer,
      indexOfLastCustomer
    );

  const totalPages = Math.ceil(
    customers.length / customersPerPage
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">

      <h1 className="text-2xl font-semibold mb-6">
        Customers
      </h1>

      {/* Search */}
      <div className="mb-4 flex gap-3">

        <input
          type="text"
          placeholder="Search customer"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          onKeyDown={handleKeyDown}
          className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          Search
        </button>

      </div>

      {/* Sync */}
      <div className="mb-6 flex gap-3">

        <input
          type="text"
          placeholder="Enter Sheet ID"
          value={sheetId}
          onChange={(e) =>
            setSheetId(e.target.value)
          }
          className="border border-gray-300 px-3 py-2 rounded w-full text-sm"
        />

        <button
          onClick={handleSync}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          Sync
        </button>

      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100">

            <tr>
              <th className="text-left px-4 py-3">
                P_ID
              </th>

              <th className="text-left px-4 py-3">
                Customer Name
              </th>

              <th className="text-left px-4 py-3">
                Mobile Number
              </th>

              <th className="text-left px-4 py-3">
                Amount
              </th>

              <th className="text-left px-4 py-3">
                Due Date
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6"
                >
                  Loading...
                </td>
              </tr>

            ) : customers.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6"
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
                  <td className="px-4 py-3">
                    {customer.p_id}
                  </td>

                  <td className="px-4 py-3">
                    {customer.cust_name}
                  </td>

                  <td className="px-4 py-3">
                    {customer.mobile_number}
                  </td>

                  <td className="px-4 py-3">
                    {customer.amount}
                  </td>

                  <td className="px-4 py-3">
                    {customer.due_date}
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
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}