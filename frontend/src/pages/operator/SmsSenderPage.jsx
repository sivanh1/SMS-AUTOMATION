import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function SmsSenderPage() {
  const [pId, setPId] = useState("");
  const [customer, setCustomer] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [previewMessage, setPreviewMessage] = useState("");
  const [scheduledTime, setScheduledTime] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      setErrorMessage("Enter P_ID");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await api.post(
        "/customers/customer/",
        { p_id: pId }
      );

      setCustomer(response.data);
    } catch (error) {
      setCustomer(null);

      if (error.response?.status === 404) {
        setErrorMessage("Customer doesn't exist");
      } else {
        setErrorMessage("Failed to fetch customer");
      }
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

  const sendSMS = async (isScheduled = false) => {
    if (!previewMessage) {
      toast.error("Generate preview first");
      return;
    }

    if (isScheduled && !scheduledTime) {
      toast.error("Please select a date and time to schedule");
      return;
    }

    try {
      setSending(true);
      
      const payload = {
        p_id: customer.p_id,
        message: previewMessage,
      };

      if (isScheduled && scheduledTime) {
        payload.scheduled_time = new Date(scheduledTime).toISOString();
      }

      await api.post("/sms/send/", payload);
      
      const msg = isScheduled 
        ? `SMS scheduled successfully for ${customer.cust_name}` 
        : `SMS sent successfully to ${customer.cust_name}`;

      setSuccessMessage(msg);
      toast.success(isScheduled ? "SMS scheduled" : "SMS sent");
      
      setPId("");
      setCustomer(null);
      setSelectedTemplate("");
      setPreviewMessage("");
      setScheduledTime(""); 
      
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.log(
        "SMS Send Error:",
        error.response?.data
      );

      const errorMsg =
        error.response?.data?.error ||
        "Failed to send SMS";

      setErrorMessage(errorMsg);
      toast.error(errorMsg);
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

  // NEW: Helper function to determine recommended templates based on customer data
  const getRecommendedTemplates = () => {
    if (!customer || templates.length === 0) return [];

    // Combine standard fields and dynamic extra_fields into one array of available keys
    const availableKeys = [
      "cust_name", 
      "mobile_number", 
      ...Object.keys(customer.extra_fields || {})
    ];

    return templates.filter((template) => {
      // Find all placeholders like $amount, $due_date in the template body
      const matches = template.body.match(/\$[a-zA-Z0-9_]+/g) || [];
      
      // Remove the '$' symbol to get the raw key
      const requiredPlaceholders = matches.map(match => match.slice(1));

      // If template has no placeholders, we don't strictly "recommend" it as a dynamic match
      if (requiredPlaceholders.length === 0) return false;

      // Recommend ONLY if every placeholder in the template exists in the customer's data
      return requiredPlaceholders.every(placeholder => availableKeys.includes(placeholder));
    });
  };

  const recommendedTemplates = getRecommendedTemplates();

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
        {errorMessage && (
          <p
            className="
            mt-3
            text-sm
            text-red-500
          "
          >
            {errorMessage}
          </p>
        )}
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

            <div className="col-span-2">
              <p
                className="
                text-xs
                mb-2

                text-gray-400
                dark:text-[#6b7280]
              "
              >
                Extra Details
              </p>

              <div
                className="
                flex
                flex-wrap
                gap-2
              "
              >
                {customer.extra_fields &&
                  Object.entries(customer.extra_fields).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="
                        px-3 py-1

                        rounded-lg

                        bg-gray-100
                        dark:bg-[#151515]

                        text-sm

                        text-gray-700
                        dark:text-[#d1d5db]
                      "
                      >
                        <strong>{key}</strong>: {String(value)}
                      </div>
                    )
                  )}
              </div>
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
          <div className="flex justify-between items-end mb-4">
            <h2
              className="
              text-sm
              font-medium

              text-gray-700
              dark:text-[#e5e5e5]
            "
            >
              Select template
            </h2>
          </div>

          {/* NEW: Recommended Templates Section */}
          {recommendedTemplates.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-[#9ca3af] mb-2">
                ✨ Recommended based on customer data:
              </p>
              <div className="flex flex-wrap gap-2">
                {recommendedTemplates.map((template) => (
                  <button
                    key={`rec-${template.id}`}
                    onClick={() => setSelectedTemplate(template.body)}
                    className={`
                      px-3 py-1.5 
                      text-xs font-medium 
                      rounded-full 
                      border 
                      transition-colors
                      ${
                        selectedTemplate === template.body
                          ? "bg-indigo-100 border-indigo-300 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-700/50 dark:text-indigo-400"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-[#151515] dark:border-[#2a2a2a] dark:text-[#9ca3af] dark:hover:bg-[#1c1c1c]"
                      }
                    `}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}

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

      {/* Preview and Send/Schedule Block */}
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
            mb-6

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

          {/* ACTION BUTTONS: SEND IMMEDIATELY OR SCHEDULE */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            
            {/* Send Immediately Button */}
            <button
              onClick={() => sendSMS(false)}
              disabled={sending}
              className="
              px-5 py-2
              rounded-lg
              whitespace-nowrap

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
              {sending ? "Sending..." : "Send Immediately"}
            </button>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-gray-200 dark:bg-[#2a2a2a]"></div>
            <div className="block sm:hidden h-px w-full bg-gray-200 dark:bg-[#2a2a2a]"></div>

            {/* Schedule Inputs */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="
                flex-1
                px-4 py-2
                rounded-lg
                outline-none
                text-sm

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
              />

              <button
                onClick={() => sendSMS(true)}
                disabled={sending || !scheduledTime}
                className="
                px-5 py-2
                rounded-lg
                text-sm
                whitespace-nowrap

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
                {sending ? "Scheduling..." : "Schedule SMS"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}