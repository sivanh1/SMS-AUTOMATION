import { useEffect, useState } from "react";

import api from "../../services/api";

export default function TemplatesPage() {

  const [templates, setTemplates] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [templateName, setTemplateName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [nameError, setNameError] =
    useState("");

  const [messageError, setMessageError] =
    useState("");



  // FETCH TEMPLATES
  const fetchTemplates = async () => {

    setErrorMessage("");

    try {

      setLoading(true);

      const res =
        await api.get("/templates/");

      setTemplates(res.data);

    } catch (error) {

      console.log(
        "Fetch Templates Error:",
        error.response?.data
      );

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "Unable to fetch templates"
      );

    } finally {

      setLoading(false);
    }
  };



  // CREATE TEMPLATE
  const handleCreate = async () => {

    setErrorMessage("");

    setNameError("");

    setMessageError("");

    let hasError = false;

    if (!templateName.trim()) {

      setNameError(
        "Template name cannot be blank"
      );

      hasError = true;
    }

    if (!message.trim()) {

      setMessageError(
        "Message body cannot be blank"
      );

      hasError = true;
    }

    if (hasError) return;

    try {

      await api.post(
        "/templates/create/",
        {
          name: templateName,
          body: message,
        }
      );

      setSuccessMessage(
        "Template created successfully"
      );

      setTemplateName("");

      setMessage("");

      fetchTemplates();

      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);

    } catch (error) {

      console.log(
        "Create Template Error:",
        error.response?.data
      );

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "Failed to create template"
      );
    }
  };



  // EDIT TEMPLATE
  const handleEdit = (template) => {

    setEditingId(template.id);

    setTemplateName(template.name);

    setMessage(template.body);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };



  // UPDATE TEMPLATE
  const handleUpdate = async () => {

    setErrorMessage("");

    setNameError("");

    setMessageError("");

    let hasError = false;

    if (!templateName.trim()) {

      setNameError(
        "Template name cannot be blank"
      );

      hasError = true;
    }

    if (!message.trim()) {

      setMessageError(
        "Message body cannot be blank"
      );

      hasError = true;
    }

    if (hasError) return;

    try {

      await api.put(
        `/templates/update/${editingId}/`,
        {
          name: templateName,
          body: message,
        }
      );

      setSuccessMessage(
        "Template updated successfully"
      );

      setEditingId(null);

      setTemplateName("");

      setMessage("");

      fetchTemplates();

      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);

    } catch (error) {

      console.log(
        "Update Template Error:",
        error.response?.data
      );

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "Failed to update template"
      );
    }
  };



  // DELETE TEMPLATE
  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this template?"
      );

    if (!confirmDelete) return;

    setErrorMessage("");

    try {

      await api.delete(
        `/templates/delete/${id}/`
      );

      setSuccessMessage(
        "Template deleted successfully"
      );

      fetchTemplates();

      setTimeout(() => {

        setSuccessMessage("");

      }, 3000);

    } catch (error) {

      console.log(
        "Delete Template Error:",
        error.response?.data
      );

      setErrorMessage(

        error.response?.data?.error ||

        error.response?.data?.detail ||

        "Delete failed"
      );
    }
  };



  // CANCEL EDIT
  const cancelEdit = () => {

    setEditingId(null);

    setTemplateName("");

    setMessage("");

    setNameError("");

    setMessageError("");

    setErrorMessage("");
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

      {/* HEADER */}
      <div className="mb-8">

        <h1
          className="
            text-3xl
            font-semibold

            text-gray-900
            dark:text-[#e5e5e5]
          "
        >
          SMS Templates
        </h1>

        <p
          className="
            text-sm
            mt-1

            text-gray-500
            dark:text-[#9ca3af]
          "
        >
          Create and manage message templates
        </p>

      </div>



      {/* SUCCESS MESSAGE */}
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



      {/* ERROR MESSAGE */}
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



      {/* FORM */}
      <div
        className="
          bg-white
          dark:bg-[#181818]

          border
          border-gray-200
          dark:border-[#2a2a2a]

          rounded-xl

          p-5
          mb-6

          transition-colors
          duration-300
        "
      >

        <h2
          className="
            text-lg
            font-medium
            mb-4

            text-gray-900
            dark:text-[#e5e5e5]
          "
        >

          {editingId
            ? "Update Template"
            : "Create Template"}

        </h2>



        <div className="space-y-4">

          {/* TEMPLATE NAME */}
          <div>

            <input
              type="text"

              placeholder="Template name"

              value={templateName}

              onChange={(e) =>
                setTemplateName(
                  e.target.value
                )
              }

              className="
                w-full

                px-4 py-3

                rounded-lg

                outline-none

                bg-white
                dark:bg-[#121212]

                border
                border-gray-200
                dark:border-[#2a2a2a]

                text-gray-900
                dark:text-[#e5e5e5]

                placeholder:text-gray-400
                dark:placeholder:text-[#777]

                focus:border-gray-400
                dark:focus:border-[#444]

                transition-colors
              "
            />

            {nameError && (

              <p
                className="
                  mt-2

                  text-sm

                  text-red-500
                  dark:text-red-400
                "
              >
                {nameError}
              </p>
            )}

          </div>



          {/* MESSAGE */}
          {/* MESSAGE */}
          <div>

            <textarea
              rows="5"

              placeholder="Enter your message..."

              value={message}

              onChange={(e) => {
                if (e.target.value.length <= 160)
                  setMessage(e.target.value);
              }}

              className="
                w-full

                px-4 py-3

                rounded-lg

                outline-none
                resize-none

                bg-white
                dark:bg-[#121212]

                border
                border-gray-200
                dark:border-[#2a2a2a]

                text-gray-900
                dark:text-[#e5e5e5]

                placeholder:text-gray-400
                dark:placeholder:text-[#777]

                focus:border-gray-400
                dark:focus:border-[#444]

                transition-colors
              "
            />

            <p
              className={`
              mt-1
              text-xs
              text-right
              ${message.length >= 160
                  ? "text-red-500 dark:text-red-400"
                  : "text-gray-400 dark:text-[#666]"
                }
  `}
            >
              {message.length}/160
            </p>

            {messageError && (

              <p
                className="
                  mt-2

                  text-sm

                  text-red-500
                  dark:text-red-400
                "
              >
                {messageError}
              </p>
            )}

          </div>


          {/* ACTIONS */}
          <div className="flex gap-3">

            {editingId ? (

              <>

                <button
                  onClick={handleUpdate}

                  className="
                    px-5 py-2

                    rounded-lg

                    bg-gray-900
                    dark:bg-[#222222]

                    text-white

                    hover:bg-black
                    dark:hover:bg-[#2c2c2c]

                    transition
                  "
                >
                  Update
                </button>



                <button
                  onClick={cancelEdit}

                  className="
                    px-5 py-2

                    rounded-lg

                    border
                    border-gray-300
                    dark:border-[#2a2a2a]

                    text-gray-700
                    dark:text-[#9ca3af]

                    hover:bg-gray-100
                    dark:hover:bg-[#1c1c1c]

                    transition
                  "
                >
                  Cancel
                </button>

              </>

            ) : (

              <button
                onClick={handleCreate}

                className="
                  px-5 py-2

                  rounded-lg

                  bg-gray-900
                  dark:bg-[#222222]

                  text-white

                  hover:bg-black
                  dark:hover:bg-[#2c2c2c]

                  transition
                "
              >
                Create
              </button>

            )}

          </div>

        </div>

      </div>



      {/* TEMPLATE LIST */}
      {loading ? (

        <div
          className="
            text-center
            py-10

            text-gray-500
            dark:text-[#9ca3af]
          "
        >
          Loading templates...
        </div>

      ) : templates.length === 0 ? (

        <div
          className="
            text-center
            py-10

            text-gray-500
            dark:text-[#9ca3af]
          "
        >
          No templates found
        </div>

      ) : (

        <div className="space-y-4">

          {templates.map((template) => (

            <div
              key={template.id}

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

              {/* TOP */}
              <div className="mb-4">

                <h2
                  className="
                    text-lg
                    font-medium

                    text-gray-900
                    dark:text-[#e5e5e5]
                  "
                >
                  {template.name}
                </h2>

                <p
                  className="
                    text-sm
                    mt-1

                    text-gray-500
                    dark:text-[#9ca3af]
                  "
                >
                  Created by {template.created_by}
                </p>

              </div>



              {/* MESSAGE */}
              <div
                className="
                  bg-gray-50
                  dark:bg-[#121212]

                  rounded-lg

                  p-4
                  mb-4
                "
              >

                <p
                  className="
                    text-sm
                    whitespace-pre-wrap
                    leading-relaxed

                    text-gray-700
                    dark:text-[#d4d4d4]
                  "
                >
                  {template.body}
                </p>

              </div>



              {/* BUTTONS */}
              <div className="flex gap-3">

                <button
                  onClick={() =>
                    handleEdit(template)
                  }

                  className="
                    px-4 py-2

                    rounded-lg

                    text-sm

                    border
                    border-gray-300
                    dark:border-[#2a2a2a]

                    text-gray-700
                    dark:text-[#9ca3af]

                    hover:bg-gray-100
                    dark:hover:bg-[#1c1c1c]

                    transition
                  "
                >
                  Edit
                </button>



                <button
                  onClick={() =>
                    handleDelete(template.id)
                  }

                  className="
                    px-4 py-2

                    rounded-lg

                    text-sm

                    border
                    border-gray-300
                    dark:border-[#2a2a2a]

                    text-gray-700
                    dark:text-[#9ca3af]

                    hover:bg-gray-100
                    dark:hover:bg-[#1c1c1c]

                    transition
                  "
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}