import { useEffect, useState } from "react";
import api from "../../services/api";

// --- Icons (Inline SVGs for portability) ---
const Icons = {
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Admin: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  Template: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  Message: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  )
};

// Stateful helper component to contain message truncation and toggles smoothly
const MessageCell = ({ message }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongMessage = message && message.length > 60;

  return (
    <div className="text-sm max-w-xs text-gray-600 dark:text-gray-300">
      <p className={`leading-relaxed ${isExpanded ? "whitespace-pre-wrap break-words" : "line-clamp-2"}`}>
        {message}
      </p>
      {isLongMessage && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold mt-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none transition-colors"
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
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0f0f0f] p-6 lg:p-8 xl:p-10 transition-colors duration-300 font-sans">
      
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm mt-1.5 text-gray-500 dark:text-gray-400">
          Welcome back! Here's an overview of your system's performance today.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* CUSTOMERS */}
        <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2a2a2a] shadow-sm rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <Icons.Users />
            </div>
          </div>
          {loading ? (
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-20"></div>
          ) : (
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.customers}</h2>
          )}
        </div>

        {/* USERS */}
        <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2a2a2a] shadow-sm rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">System Users</p>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
              <Icons.Admin />
            </div>
          </div>
          {loading ? (
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-20"></div>
          ) : (
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.users}</h2>
          )}
        </div>

        {/* TEMPLATES */}
        <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2a2a2a] shadow-sm rounded-2xl p-6 flex flex-col justify-between transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Templates</p>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
              <Icons.Template />
            </div>
          </div>
          {loading ? (
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-20"></div>
          ) : (
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.templates}</h2>
          )}
        </div>

        {/* SMS LOGS BREAKDOWN */}
        <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2a2a2a] shadow-sm rounded-2xl p-6 transition-all hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total SMS Logs</p>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <Icons.Message />
            </div>
          </div>

          <div className="flex items-end justify-between">
            {loading ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-20"></div>
            ) : (
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{stats.logs}</span>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-[#2a2a2a] flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Delivered</span>
              {loading ? (
                 <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-10"></div>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 w-fit">
                  {stats.loggedCount}
                </span>
              )}
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Failed</span>
              {loading ? (
                 <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-10"></div>
              ) : (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100/50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 w-fit">
                  {stats.failedCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECENT LOGS SECTION */}
      <div className="bg-white dark:bg-[#181818] border border-gray-100 dark:border-[#2a2a2a] shadow-sm rounded-2xl overflow-hidden transition-all">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-[#2a2a2a] flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">
            Recent SMS Logs
          </h2>
          
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-50/50 dark:bg-[#131313] border-b border-gray-100 dark:border-[#2a2a2a]">
              <tr className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                <th className="px-6 py-4">P_ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Mobile</th>
                <th className="px-6 py-4 w-1/3">Message</th>
                <th className="px-6 py-4">Sent By</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-[#2a2a2a]">
              {loading ? (
                // Table Loading Skeletons
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="7" className="px-6 py-4">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : recentLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Icons.Message />
                      <p className="mt-2">No recent logs found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors duration-200 group"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      {log.p_id}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {log.cust_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 font-mono">
                      {log.mobile_number}
                    </td>

                    <td className="px-6 py-4">
                      <MessageCell message={log.message} />
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        
                        {log.sent_by?.username || "System"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          log.status === "failed"
                            ? "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                            : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          log.status === "failed" ? "bg-rose-500" : "bg-emerald-500"
                        }`}></span>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
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