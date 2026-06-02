import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function TemplatesPage() {

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  const [templateName, setTemplateName] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  // FETCH TEMPLATES
  const fetchTemplates = async () => {

    try {

      setLoading(true);

      const res =
        await api.get("/templates/");

      setTemplates(res.data);

    } catch (err) {

      toast.error(
        "Unable to fetch templates"
      );

    } finally {

      setLoading(false);
    }
  };

  // CREATE TEMPLATE
  const handleCreate = async () => {

    if (
      !templateName.trim() ||
      !message.trim()
    ) {
      toast.error(
        "Please fill all fields"
      );
      return;
    }

    try {

      await api.post(
        "/templates/create/",
        {
          name: templateName,
          body: message,
        }
      );

      toast.success(
        "Template created"
      );

      setTemplateName("");
      setMessage("");

      fetchTemplates();

    } catch (err) {

      toast.error(
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

    try {

      await api.put(
        `/templates/update/${editingId}/`,
        {
          name: templateName,
          body: message,
        }
      );

      toast.success(
        "Template updated"
      );

      setEditingId(null);

      setTemplateName("");

      setMessage("");

      fetchTemplates();

    } catch (err) {

      toast.error(
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

    try {

      await api.delete(
        `/templates/delete/${id}/`
      );

      toast.success(
        "Template deleted"
      );

      fetchTemplates();

    } catch (err) {

      toast.error(
        "Delete failed"
      );
    }
  };

  // CANCEL EDIT
  const cancelEdit = () => {

    setEditingId(null);

    setTemplateName("");

    setMessage("");
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
        <input
          type="text"
          placeholder="Template name"
          value={templateName}
          onChange={(e) =>
            setTemplateName(e.target.value)
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

        {/* MESSAGE */}
        <textarea
          rows="5"
          placeholder="Enter your message..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
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