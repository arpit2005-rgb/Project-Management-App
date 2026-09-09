import { useEffect, useState } from "react";
import axios from "axios";

function TasksPage() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await axios.get("/projects");
        setProjects(res.data.data);

        if (res.data.data.length) {
          setSelectedProjectId(res.data.data[0].project._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load projects");
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (!selectedProjectId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const loadTasks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/tasks/${selectedProjectId}`);
        setTasks(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [selectedProjectId]);

  return (
    <div>
      <h1>Tasks</h1>

      {projects.length > 0 && (
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="select-control"
        >
          {projects.map((item) => (
            <option key={item.project._id} value={item.project._id}>
              {item.project.name}
            </option>
          ))}
        </select>
      )}

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="card-grid small-grid">
          {tasks.map((task) => (
            <div className="card" key={task._id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <small>
                Assigned to: {task.assignedTo?.username || "Unassigned"}
              </small>
              <br />
              <small>Status: {task.status}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TasksPage;
