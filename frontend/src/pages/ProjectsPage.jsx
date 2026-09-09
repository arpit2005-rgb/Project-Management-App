import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const loadProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/projects");
      setProjects(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditingProjectId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editingProjectId) {
        await axios.put(`/projects/${editingProjectId}`, form);
      } else {
        await axios.post("/projects", form);
      }

      resetForm();
      loadProjects();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingProjectId
            ? "Failed to update project"
            : "Failed to create project"),
      );
    }
  };

  const handleEditProject = (project) => {
    setEditingProjectId(project._id);
    setForm({ name: project.name, description: project.description || "" });
  };

  const handleDeleteProject = async (projectId) => {
    try {
      setError("");
      await axios.delete(`/projects/${projectId}`);
      loadProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete project");
    }
  };

  return (
    <div>
      <h1>Projects</h1>

      <form onSubmit={handleSubmit} className="small-form">
        <input
          type="text"
          name="name"
          placeholder="Project name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">
          {editingProjectId ? "Update Project" : "Create Project"}
        </button>
        {editingProjectId && (
          <button type="button" onClick={resetForm} className="secondary-btn">
            Cancel
          </button>
        )}
      </form>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <div className="card-grid">
          {projects.map((item) => (
            <div className="card" key={item.project._id}>
              <h3>{item.project.name}</h3>
              <p>{item.project.description}</p>
              <small>
                Members: {item.project.members} | Role: {item.role}
              </small>
              <div className="card-actions">
                <Link to={`/projects/${item.project._id}`}>Open Details</Link>
                <button
                  type="button"
                  onClick={() => handleEditProject(item.project)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProject(item.project._id)}
                  className="danger-btn"
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

export default ProjectsPage;
