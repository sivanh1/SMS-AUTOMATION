import { useState } from "react";

import api from "../services/api";

export default function XLSXUpload({

  fetchCustomers,

}) {

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");



  // IMPORT XLSX
  const importCustomersXLSX = async () => {

    setErrorMessage("");

    if (!file) {

      setErrorMessage(
        "Please select XLSX file"
      );

      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", file);

      const res = await api.post(

        "/customers/import-xlsx/",

        formData,

        {
          headers: {
            "Content-Type":
            "multipart/form-data",
          },
        }
      );

      setSuccessMessage(
        res.data.message
      );

      await fetchCustomers();

      setFile(null);

      setTimeout(() => {

        setSuccessMessage("");

      }, 4000);

    } catch (error) {

      console.log(
        "XLSX Import Error:",
        error
      );

      setErrorMessage(

        error.response?.data?.error ||

        "XLSX import failed"
      );

    } finally {

      setLoading(false);
    }
  };



  return (

    <div className="mt-4">

      {/* Success */}
      {successMessage && (

        <div
          className="
            mb-3
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
          "
        >
          {successMessage}
        </div>
      )}



      {/* Error */}
      {errorMessage && (

        <div
          className="
            mb-3
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
          "
        >
          {errorMessage}
        </div>
      )}



      <div className="flex flex-col md:flex-row gap-3">

        <div className="flex-1">

          <input
            type="file"

            accept=".xlsx"

            onChange={(e) =>
              setFile(
                e.target.files[0]
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

              file:mr-4
              file:px-4
              file:py-1
              file:rounded-md
              file:border-0

              file:bg-gray-100
              dark:file:bg-[#222222]

              file:text-gray-700
              dark:file:text-[#e5e5e5]

              transition-colors
            "
          />

        </div>



        <button
          onClick={importCustomersXLSX}

          disabled={loading}

          className="
            px-5 py-2

            rounded-lg

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
          {loading
            ? "Importing..."
            : "Import XLSX"}
        </button>

      </div>

    </div>
  );
}