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

  const dynamicColumns = customers.length > 0
    ? Object.keys(customers[0].extra_fields || {})
    : [];

  const customersPerPage = 5;

  // Fetch Customers
  const fetchCustomers = async () => {
    setErrorMessage("");
    try {
      setLoading(true);
      const res = await api.get("/customers/listcustomers/");
      setCustomers(res.data);
    } catch (error) {
      console.log("Fetch Customers Error:", error.response?.data);
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
      setSearchError("Search field cannot be blank");
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/customers/search/?search=${search}`);

      // Exact P_ID result
      if (!res.data || res.data.length === 0) {
        setCustomers([]);
        setErrorMessage("No customer found");
      } else {
        // if API returns single object
        const customerData = Array.isArray(res.data) ? res.data : [res.data];
        setCustomers(customerData);
        setCurrentPage(1);
        setSuccessMessage("Customer searched successfully");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    } catch (error) {
      console.log("Search Error:", error.response?.data);
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
      setSheetError("Google Sheet ID cannot be blank");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/customers/sync/", {
        sheet_id: sheetId,
      });

      setSuccessMessage(res.data.message);
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

  // Pagination
  const lastIndex = currentPage * customersPerPage;
  const firstIndex = lastIndex - customersPerPage;
  const currentCustomers = customers.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(customers.length / customersPerPage);

  // Enter Search
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchCustomers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0f0f0f] p-6 lg:p-8 xl:p-10 transition-colors duration-300 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Customers
        </h1>
        <p className="text-sm mt-1.5 text-gray-500 dark:text-gray-400">
          Manage your customer records
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium border shadow-sm border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 transition-colors flex items-center">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm font-medium border shadow-sm border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 transition-colors flex items-center">
          {errorMessage}
        </div>
      )}

      {/* Search + Actions */}
      <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2a2a2a] shadow-sm rounded-2xl p-5 mb-8 transition-colors duration-300">
        
        {/* Search */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search customer by ID, Name, or Mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-[#151515] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {searchError && (
              <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
                {searchError}
              </p>
            )}
          </div>

          <button
            onClick={searchCustomers}
            className="px-6 py-2.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-[#181818] shadow-sm transition-all"
          >
            Search
          </button>
        </div>

        {/* Sync */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Google Sheet ID"
              value={sheetId}
              onChange={(e) => setSheetId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none border border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#121212] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:bg-white dark:focus:bg-[#151515] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
            {sheetError && (
              <p className="mt-1.5 text-xs font-medium text-rose-500 dark:text-rose-400">
                {sheetError}
              </p>
            )}
          </div>

          <button
            onClick={syncCustomers}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-[#333] bg-white dark:bg-[#181818] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#222] shadow-sm transition-all"
          >
            Sync
          </button>

          <button
            onClick={fetchCustomers}
            className="px-6 py-2.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-[#333] bg-white dark:bg-[#181818] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#222] shadow-sm transition-all"
          >
            Refresh
          </button>
        </div>
        
        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-[#2a2a2a]">
          <XLSXUpload fetchCustomers={fetchCustomers} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2a2a2a] shadow-sm rounded-2xl overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          {/* min-w-full ensures the table scales well even with evenly sized columns */}
          <table className="min-w-full table-fixed border-collapse text-left">
            <thead className="bg-gray-50/80 dark:bg-[#131313] border-b border-gray-100 dark:border-[#2a2a2a]">
              <tr className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                {/* Removed fixed widths to allow table-fixed to evenly space all columns */}
                <th className="px-6 py-4">P_ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Mobile</th>
                {dynamicColumns.map((column) => (
                  <th key={column} className="px-6 py-4">
                    {column.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 dark:divide-[#222]">
              {loading ? (
                <tr>
                  <td colSpan={3 + dynamicColumns.length} className="text-center py-16">
                    <div className="inline-flex items-center justify-center space-x-2 text-sm text-gray-400 dark:text-gray-500 font-medium animate-pulse">
                      <span>Loading customer data...</span>
                    </div>
                  </td>
                </tr>
              ) : currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan={3 + dynamicColumns.length} className="text-center py-16">
                    <div className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                      No customers found
                    </div>
                  </td>
                </tr>
              ) : (
                currentCustomers.map((customer) => (
                  <tr
                    key={customer.p_id}
                    className="hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a] transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                      {customer.p_id}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white truncate" title={customer.cust_name}>
                      {customer.cust_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono truncate">
                      {customer.mobile_number}
                    </td>

                    {dynamicColumns.map((column) => (
                      <td key={column} className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 align-top">
                        <div className="flex items-start">
                          <span
                            className="block truncate w-full whitespace-pre-wrap break-words leading-relaxed"
                            title={customer.extra_fields?.[column] ?? ""}
                          >
                            {customer.extra_fields?.[column] ?? "-"}
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 px-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Page <span className="text-gray-900 dark:text-white">{currentPage}</span> of <span className="text-gray-900 dark:text-white">{totalPages || 1}</span>
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-[#333] bg-white dark:bg-[#181818] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Previous
          </button>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-[#333] bg-white dark:bg-[#181818] text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#222] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}