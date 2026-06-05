import { useEffect, useState } from "react";

import api from "../../services/api";

export default function BulkSMS() {

  const [templates, setTemplates] =
    useState([]);

  const [selectedTemplate, setSelectedTemplate] =
    useState("");

  const [bulkPreview, setBulkPreview] =
    useState([]);

  // NEW STATE FOR SCHEDULING
  const [scheduledTime, setScheduledTime] = 
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [fieldError, setFieldError] =
    useState("");



  const fetchTemplates = async () => {

    try {

      const response =
        await api.get("/templates/");

      setTemplates(response.data);

    } catch (error) {

      console.log(
        "Template Error:",
        error.response?.data
      );

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "Failed to load templates"
      );
    }
  };



  const previewBulkSMS = async () => {

    setErrorMessage("");
    setFieldError("");

    if (!selectedTemplate) {

      setFieldError(
        "Please select a template"
      );

      return;

    }

    try {

      setLoading(true);

      const response =
        await api.post(
          "/sms/bulk/preview/",
          {
            template:
              selectedTemplate
          }
        );

      const customers =
        response.data.customers || [];

      setBulkPreview(customers);

      // NO CUSTOMERS
      if (customers.length === 0) {

        setErrorMessage(
          "No customers available"
        );

        return;
      }

      // SUCCESS ONLY IF CUSTOMERS EXIST
      setSuccessMessage(
        "Bulk preview generated successfully"
      );

      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);

    } catch (error) {

      console.log(
        "Bulk Preview Error:",
        error.response?.data
      );

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "Failed to generate preview"
      );

    } finally {

      setLoading(false);

    }
  };



  // MODIFIED TO HANDLE SCHEDULING
  const sendBulkSMS = async (isScheduled = false) => {

    setErrorMessage("");

    if (bulkPreview.length === 0) {

      setErrorMessage(
        "Generate preview before sending SMS"
      );

      return;
    }

    if (isScheduled && !scheduledTime) {
      
      setErrorMessage(
        "Please select a date and time to schedule"
      );

      return;
    }

    try {

      setSending(true);

      const payload = {
        customers: bulkPreview
      };

      if (isScheduled && scheduledTime) {
        payload.scheduled_time = new Date(scheduledTime).toISOString();
      }

      await api.post(
        "/sms/bulk/send/",
        payload
      );

      const msg = isScheduled
        ? `Bulk SMS scheduled successfully for ${bulkPreview.length} customers`
        : `SMS sent successfully to ${bulkPreview.length} customers`;

      setSuccessMessage(msg);

      setBulkPreview([]);

      setSelectedTemplate("");

      setScheduledTime(""); // Reset schedule time

      setTimeout(() => {

        setSuccessMessage("");

      }, 4000);

    } catch (error) {

      console.log(
        "Bulk Send Error:",
        error.response?.data
      );

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "Failed to send SMS"
      );

    } finally {

      setSending(false);
    }
  };



  useEffect(() => {

    fetchTemplates();

  }, []);



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
          Bulk SMS
        </h1>

        <p
          className="
            text-sm
            mt-1

            text-gray-500
            dark:text-[#9ca3af]
          "
        >
          Send SMS to multiple customers
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



      {/* Template Selection */}
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

          onChange={(e) =>
            setSelectedTemplate(
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

            focus:border-gray-400
            dark:focus:border-[#3a3a3a]

            transition-colors
          "
        >

          <option value="">
            Choose a template
          </option>

          {templates.map((template) => (

            <option
              key={template.id}
              value={template.body}
            >
              {template.name}
            </option>

          ))}

        </select>



        {fieldError && (

          <p
            className="
              mt-2

              text-sm

              text-red-500
              dark:text-red-400
            "
          >
            {fieldError}
          </p>
        )}



        <button
          onClick={previewBulkSMS}

          disabled={loading}

          className="
            mt-3

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
          {loading
            ? "Generating..."
            : "Preview Bulk SMS"}
        </button>

      </div>



      {/* Bulk Preview */}
      {bulkPreview.length > 0 && (

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

          <div
            className="
              flex
              flex-col
              xl:flex-row
              xl:items-center
              justify-between
              gap-4

              mb-6
            "
          >

            <div>

              <h2
                className="
                  text-sm
                  font-medium

                  text-gray-700
                  dark:text-[#e5e5e5]
                "
              >
                SMS Preview
              </h2>

              <p
                className="
                  text-xs
                  mt-1

                  text-gray-500
                  dark:text-[#6b7280]
                "
              >
                {bulkPreview.length} customers loaded
              </p>

            </div>



            {/* ACTION BUTTONS: SEND IMMEDIATELY OR SCHEDULE */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              
              <button
                onClick={() => sendBulkSMS(false)}
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
                  onClick={() => sendBulkSMS(true)}
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
                  {sending ? "Scheduling..." : "Schedule All"}
                </button>
              </div>

            </div>

          </div>



          <div className="space-y-4">

            {bulkPreview.map((customer) => (

              <div
                key={customer.p_id}

                className="
                  border

                  border-gray-200
                  dark:border-[#2a2a2a]

                  rounded-xl

                  bg-gray-50
                  dark:bg-[#151515]

                  p-4

                  transition-colors
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between

                    mb-3
                  "
                >

                  <div>

                    <h3
                      className="
                        text-sm
                        font-medium

                        text-gray-800
                        dark:text-[#e5e5e5]
                      "
                    >
                      {customer.cust_name}
                    </h3>

                    <p
                      className="
                        text-xs

                        text-gray-500
                        dark:text-[#9ca3af]
                      "
                    >
                      {customer.mobile_number}
                    </p>

                  </div>



                  <div className="text-right">

                    
                    
                  </div>

                </div>



                <div
                  className="
                    border

                    border-gray-200
                    dark:border-[#2a2a2a]

                    rounded-lg

                    bg-gray-100
                    dark:bg-[#101010]

                    px-4 py-3

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
                    {customer.message}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
}