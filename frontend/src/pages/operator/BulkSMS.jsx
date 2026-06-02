import { useEffect, useState } from "react";

import api from "../../services/api";

export default function BulkSMS() {

  const [templates, setTemplates] =
    useState([]);

  const [selectedTemplate, setSelectedTemplate] =
    useState("");

  const [bulkPreview, setBulkPreview] =
    useState([]);

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

      setBulkPreview(
        response.data.customers
      );

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



  const sendBulkSMS = async () => {

    setErrorMessage("");

    if (bulkPreview.length === 0) {

      setErrorMessage(
        "Generate preview before sending SMS"
      );

      return;
    }

    try {

      setSending(true);

      await api.post(
        "/sms/bulk/send/",
        {
          customers:
            bulkPreview
        }
      );

      setSuccessMessage(

        `SMS sent successfully to ${bulkPreview.length} customers`
      );

      setBulkPreview([]);

      setSelectedTemplate("");

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
              items-center
              justify-between

              mb-5
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



            <button
              onClick={sendBulkSMS}

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
                : "Send All SMS"}
            </button>

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

                    <p
                      className="
                        text-xs

                        text-gray-400
                        dark:text-[#6b7280]
                      "
                    >
                      Amount
                    </p>

                    <p
                      className="
                        text-sm
                        font-medium

                        text-gray-800
                        dark:text-[#e5e5e5]
                      "
                    >
                      {customer.amount}
                    </p>

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