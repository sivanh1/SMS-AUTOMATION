import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function QueryPage({ isAdmin }) {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium' });
  const [reply, setReply] = useState({});

  const fetchQueries = async () => {
    try {
      const endpoint = isAdmin ? "/query/all/" : "/query/my/";
      const res = await api.get(endpoint);
      setQueries(res.data);
    } catch (error) {
      toast.error("Failed to fetch queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [isAdmin]);

  const createQuery = async (e) => {
    e.preventDefault();
    try {
      await api.post("/query/create/", formData);
      toast.success("Query submitted successfully");
      setFormData({ title: '', description: '', priority: 'medium' });
      fetchQueries();
    } catch (err) {
      toast.error("Failed to create query");
    }
  };

  const resolveQuery = async (queryId) => {
    try {
      await api.patch(`/query/reply/${queryId}/`, {
        admin_response: reply[queryId],
        status: "resolved"
      });
      toast.success("Query resolved");
      fetchQueries();
    } catch (err) {
      toast.error("Failed to update query");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f] p-6 transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-[#e5e5e5]">Support Center</h1>
        <p className="text-sm mt-1 text-gray-500 dark:text-[#9ca3af]">
          {isAdmin ? "Manage and resolve user support requests" : "Track your raised issues"}
        </p>
      </div>

      {/* CREATE QUERY (Non-Admin Only) */}
      {!isAdmin && (
        <div className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-[#e5e5e5] mb-4">Raise New Query</h2>
          <form onSubmit={createQuery} className="space-y-4">
            <input 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#151515] text-sm focus:border-gray-400 dark:focus:border-[#3a3a3a] outline-none transition-colors text-gray-800 dark:text-[#e5e5e5]"
              placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required 
            />
            <textarea 
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#151515] text-sm focus:border-gray-400 dark:focus:border-[#3a3a3a] outline-none transition-colors text-gray-800 dark:text-[#e5e5e5]"
              rows={3} placeholder="Describe your issue" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required 
            />
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              Submit Query
            </button>
          </form>
        </div>
      )}

      {/* QUERY LIST */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-10 text-gray-400 dark:text-[#9ca3af]">Loading queries...</p>
        ) : queries.length === 0 ? (
          <p className="text-center py-10 text-gray-400 dark:text-[#9ca3af]">No queries found</p>
        ) : queries.map((query) => (
          <div key={query.id} className="bg-white dark:bg-[#181818] border border-gray-200 dark:border-[#2a2a2a] rounded-xl p-6 transition-colors">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-gray-800 dark:text-[#e5e5e5]">{query.title}</h3>
              <span className={`text-[10px] uppercase px-3 py-1 rounded-full font-bold ${query.status === 'resolved' ? 'bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'}`}>
                {query.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-[#9ca3af]">{query.description}</p>
            
            {query.admin_response && (
              <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-[#1c1c1c] border border-gray-200 dark:border-[#2a2a2a]">
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Admin Response</p>
                <p className="text-sm text-gray-700 dark:text-[#d1d5db]">{query.admin_response}</p>
              </div>
            )}

            {isAdmin && query.status !== 'resolved' && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#2a2a2a]">
                <textarea 
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-[#2a2a2a] bg-white dark:bg-[#151515] text-sm mb-2 text-gray-800 dark:text-[#e5e5e5]"
                  placeholder="Enter resolution notes..."
                  onChange={(e) => setReply({...reply, [query.id]: e.target.value})}
                />
                <button onClick={() => resolveQuery(query.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Mark as Resolved
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}