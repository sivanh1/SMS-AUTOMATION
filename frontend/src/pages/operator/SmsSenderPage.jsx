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
    <div
      className="
      min-h-screen
      p-6

      bg-gray-50
      dark:bg-[#0f0f0f]

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
          SMS Sender
        </h1>

        <p
          className="
          text-sm
          mt-1

          text-gray-500
          dark:text-[#9ca3af]
        "
        >
          Send SMS using templates
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
          border-green-900/30

          bg-green-950/20

          text-green-400
        "
        >
          {successMessage}
        </div>
      )}

      {/* Find Customer */}
      <div
        className="
        bg-white
        dark:bg-[#181818]

        border
        border-gray-200
        dark:border-[#2a2a2a]

        rounded-xl

        p-5
        mb-4

        transition-colors
        duration-300
      "
      >
        <h2
          className="
          text-sm
          font-medium
          mb-3

          text-gray-700
          dark:text-[#e5e5e5]
        "
        >
          Find customer
        </h2>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter P_ID"
            value={pId}
            onChange={(e) => setPId(e.target.value)}
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
            onClick={findCustomer}
            disabled={loading}
            className="
            px-5 py-2
            rounded-lg

            bg-gray-900
            dark:bg-[#222222]

            text-white
            dark:text-[#e5e5e5]

            hover:bg-black
            dark:hover:bg-[#2a2a2a]

            disabled:opacity-50

            transition-colors
          "
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Customer Details */}
      {customer && (
        <div
          className="
          bg-white
          dark:bg-[#181818]

          border
          border-gray-200
          dark:border-[#2a2a2a]

          rounded-xl

          p-5
          mb-4

          transition-colors
          duration-300
        "
        >
          <h2
            className="
            text-sm
            font-medium
            mb-4

            text-gray-700
            dark:text-[#e5e5e5]
          "
          >
            Customer details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p
                className="
                text-xs
                mb-1

                text-gray-400
                dark:text-[#6b7280]
              "
              >
                Customer name
              </p>

              <p
                className="
                text-sm
                font-medium

                text-gray-800
                dark:text-[#e5e5e5]
              "
              >
                {customer.cust_name}
              </p>
            </div>

            <div>
              <p className="text-xs mb-1 text-gray-400 dark:text-[#6b7280]">
                Mobile number
              </p>

              <p className="text-sm font-medium text-gray-800 dark:text-[#e5e5e5]">
                {customer.mobile_number}
              </p>
            </div>

            <div>
              <p className="text-xs mb-1 text-gray-400 dark:text-[#6b7280]">
                Amount
              </p>

              <p className="text-sm font-medium text-gray-800 dark:text-[#e5e5e5]">
                ₹ {customer.amount}
              </p>
            </div>

            <div>
              <p className="text-xs mb-1 text-gray-400 dark:text-[#6b7280]">
                Due date
              </p>

              <p className="text-sm font-medium text-gray-800 dark:text-[#e5e5e5]">
                {customer.due_date}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Template Selection */}
      {customer && (
        <div
          className="
          bg-white
          dark:bg-[#181818]

          border
          border-gray-200
          dark:border-[#2a2a2a]

          rounded-xl

          p-5
          mb-4

          transition-colors
          duration-300
        "
        >
          <h2
            className="
            text-sm
            font-medium
            mb-3

            text-gray-700
            dark:text-[#e5e5e5]
          "
          >
            Select template
          </h2>

          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
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

            focus:border-gray-400
            dark:focus:border-[#3a3a3a]

            transition-colors
          "
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
            className="
            mt-3

            px-5 py-2
            rounded-lg

            bg-[#222222]

            text-[#e5e5e5]

            hover:bg-[#2a2a2a]

            transition-colors
          "
          >
            Preview SMS
          </button>
        </div>
      )}

      {/* Preview */}
      {previewMessage && (

        <div
          className="
      bg-white
      dark:bg-[#181818]

      border
      border-gray-200
      dark:border-[#2a2a2a]

      rounded-xl

      p-5

      transition-colors
      duration-300
    "
        >

          <h2
            className="
        text-sm
        font-medium
        mb-3

        text-gray-700
        dark:text-[#e5e5e5]
      "
          >
            SMS preview
          </h2>



          <div
            className="
        mb-4

        px-4 py-3

        rounded-lg

        border

        border-gray-200
        dark:border-[#2a2a2a]

        bg-gray-100
        dark:bg-[#151515]

        transition-colors
      "
          >

            <p
              className="
          text-sm
          leading-relaxed
          whitespace-pre-wrap

          text-gray-700
          dark:text-[#d1d5db]
        "
            >
              {previewMessage}
            </p>

          </div>



          <button
            onClick={sendSMS}

            disabled={sending}

            className="
        px-5 py-2
        rounded-lg

        bg-gray-900
        dark:bg-[#222222]

        text-white
        dark:text-[#e5e5e5]

        hover:bg-black
        dark:hover:bg-[#2a2a2a]

        disabled:opacity-50

        transition-colors
      "
          >
            {sending
              ? "Sending..."
              : "Send SMS"}
          </button>

        </div>
      )}
    </div>
  );
}