import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function SmsSenderPage() {
  const [pId, setPId] = useState("");
  const [customer, setCustomer] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTemplates = async () => {
    try {
      const response = await api.get("/templates/");
      setTemplates(response.data);
    } catch (error) {
      toast.error("Failed to load templates");
    }
  };

  const findCustomer = async () => {
    if (!pId) {
      toast.error("Enter P ID");
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/customers/customer/", { p_id: pId });
      setCustomer(response.data);
      toast.success("Customer found");
    } catch (error) {
      setCustomer(null);
      toast.error("Customer not found");
    } finally {
      setLoading(false);
    }
  };

  const previewSMS = async () => {
    if (!customer) {
      toast.error("Find customer first");
      return;
    }
    if (!selectedTemplate) {
      toast.error("Select a template");
      return;
    }
    try {
      const response = await api.post("/customers/preview/", {
        p_id: customer.p_id,
        template: selectedTemplate,
      });
      setPreviewMessage(response.data.preview);
      toast.success("Preview generated");
    } catch (error) {
      toast.error("Failed to generate preview");
    }
  };

  const sendSMS = async () => {
    if (!previewMessage) {
      toast.error("Generate preview first");
      return;
    }
    try {
      setSending(true);
      await api.post("/sms/send/", {
        p_id: customer.p_id,
        message: previewMessage,
      });
      setSuccessMessage(`SMS sent successfully to ${customer.cust_name}`);
      toast.success("SMS sent");
      setPId("");
      setCustomer(null);
      setSelectedTemplate("");
      setPreviewMessage("");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      toast.error("Failed to send SMS");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") findCustomer();
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">SMS Sender</h1>
        <p className="text-slate-400 text-sm mt-1">Send SMS using templates</p>
      </div>

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-5 text-sm">
          {successMessage}
        </div>
      )}

      <div className="bg-white border border-slate-200 p-5 rounded-xl mb-4">
        <h2 className="text-sm font-medium text-slate-700 mb-3">Find customer</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter P_ID"
            className="flex-1 border border-slate-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-slate-400"
            value={pId}
            onChange={(e) => setPId(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={findCustomer}
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {customer && (
        <div className="bg-white border border-slate-200 p-5 rounded-xl mb-4">
          <h2 className="text-sm font-medium text-slate-700 mb-4">Customer details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Customer name</p>
              <p className="text-sm font-medium text-slate-800">{customer.cust_name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Mobile number</p>
              <p className="text-sm font-medium text-slate-800">{customer.mobile_number}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Amount</p>
              <p className="text-sm font-medium text-slate-800">₹ {customer.amount}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-0.5">Due date</p>
              <p className="text-sm font-medium text-slate-800">{customer.due_date}</p>
            </div>
          </div>
        </div>
      )}

      {customer && (
        <div className="bg-white border border-slate-200 p-5 rounded-xl mb-4">
          <h2 className="text-sm font-medium text-slate-700 mb-3">Select template</h2>
          <select
            className="w-full border border-slate-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-slate-400 bg-white text-slate-700"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          >
            <option value="">Choose a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.body}>
                {template.name}
              </option>
            ))}
          </select>
          <button
            onClick={previewSMS}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium mt-3"
          >
            Preview SMS
          </button>
        </div>
      )}

      {previewMessage && (
        <div className="bg-white border border-slate-200 p-5 rounded-xl">
          <h2 className="text-sm font-medium text-slate-700 mb-3">SMS preview</h2>
          <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3 mb-4">
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {previewMessage}
            </p>
          </div>
          <button
            onClick={sendSMS}
            disabled={sending}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-medium"
          >
            {sending ? "Sending..." : "Send SMS"}
          </button>
        </div>
      )}
    </div>
  );
}