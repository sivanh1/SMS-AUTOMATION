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

  const fetchTemplates = async () => {
    try {

      setLoading(true);

      const response =
        await api.get("/templates/");

      setTemplates(response.data);

    } catch (error) {

      toast.error("Failed to fetch templates");

    } finally {

      setLoading(false);

    }
  };

  const handleCreate = async () => {
    if (!templateName || !message) {
      toast.error("Please fill all fields");
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

      toast.success("Template created");

      setTemplateName("");
      setMessage("");

      fetchTemplates();

    } catch (error) {

      toast.error("Failed to create template");

    }
  };

  const handleEdit = (template) => {
    setEditingId(template.id);

    setTemplateName(template.name);

    setMessage(template.body);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleUpdate = async () => {
    try {

      await api.put(
        `/templates/update/${editingId}/`,
        {
          name: templateName,
          body: message,
        }
      );

      toast.success("Template updated");

      setEditingId(null);

      setTemplateName("");
      setMessage("");

      fetchTemplates();

    } catch (error) {

      toast.error("Failed to update template");

    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete template?"))
      return;

    try {

      await api.delete(
        `/templates/delete/${id}/`
      );

      toast.success("Template deleted");

      fetchTemplates();

    } catch (error) {

      toast.error("Failed to delete template");

    }
  };

  const cancelEdit = () => {
    setEditingId(null);

    setTemplateName("");

    setMessage("");
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">

      <h1 className="text-2xl font-semibold mb-6">
        SMS Templates
      </h1>

      {/* Form */}
      <div className="border border-gray-300 p-4 rounded mb-6">

        <h2 className="text-lg mb-4">
          {editingId
            ? "Update Template"
            : "Create Template"}
        </h2>

        <div className="flex flex-col gap-3">

          <input
            type="text"
            placeholder="Template name"
            value={templateName}
            onChange={(e) =>
              setTemplateName(e.target.value)
            }
            className="border border-gray-300 px-3 py-2 rounded text-sm"
          />

          <textarea
            rows="4"
            placeholder="Enter message"
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            className="border border-gray-300 px-3 py-2 rounded text-sm resize-none"
          />

          <div className="flex gap-2">

            {editingId ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
                >
                  Update
                </button>

                <button
                  onClick={cancelEdit}
                  className="border px-4 py-2 rounded text-sm"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleCreate}
                className="bg-black text-white px-4 py-2 rounded text-sm"
              >
                Create
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Templates */}
      {loading ? (

        <p>Loading...</p>

      ) : templates.length === 0 ? (

        <p>No templates found</p>

      ) : (

        <div className="space-y-4">

          {templates.map((template) => (

            <div
              key={template.id}
              className="border border-gray-300 p-4 rounded"
            >

              <h2 className="font-medium">
                {template.name}
              </h2>

              <p className="text-sm text-gray-500 mb-3">
                Created by: {template.created_by}
              </p>

              <div className="border p-3 rounded bg-gray-50 mb-4">

                <p className="text-sm whitespace-pre-wrap">
                  {template.body}
                </p>

              </div>

              <div className="flex gap-2">

                <button
                  onClick={() =>
                    handleEdit(template)
                  }
                  className="border px-3 py-1 rounded text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(template.id)
                  }
                  className="border px-3 py-1 rounded text-sm"
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