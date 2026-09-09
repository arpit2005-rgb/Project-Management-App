import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProjectDetailsPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newMember, setNewMember] = useState({ email: "", role: "member" });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
  });
  const [newNote, setNewNote] = useState({ content: "" });

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectRes, membersRes, tasksRes, notesRes] = await Promise.all([
        axios.get(`/projects/${projectId}`),
        axios.get(`/projects/${projectId}/members`),
        axios.get(`/tasks/${projectId}`),
        axios.get(`/notes/${projectId}`),
      ]);

      setProject(projectRes.data.data);
      setMembers(membersRes.data.data);
      setTasks(tasksRes.data.data);
      setNotes(notesRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await axios.post(`/projects/${projectId}/members`, newMember);
      setNewMember({ email: "", role: "member" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      setError("");
      await axios.delete(`/projects/${projectId}/members/${memberId}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  const handleRoleChange = async (memberId, role) => {
    try {
      setError("");
      await axios.put(`/projects/${projectId}/members/${memberId}`, {
        newRole: role,
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update member role");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await axios.post(`/tasks/${projectId}`, newTask);
      setNewTask({
        title: "",
        description: "",
        assignedTo: "",
        status: "todo",
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdateTaskStatus = async (taskId, nextStatus) => {
    try {
      setError("");
      await axios.put(`/tasks/${projectId}/t/${taskId}`, {
        status: nextStatus,
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task status");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      setError("");
      await axios.delete(`/tasks/${projectId}/t/${taskId}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const handleCreateNote = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await axios.post(`/notes/${projectId}`, newNote);
      setNewNote({ content: "" });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create note");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setError("");
      await axios.delete(`/notes/${projectId}/n/${noteId}`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete note");
    }
  };

  if (loading) return <p>Loading project details...</p>;
  if (error) return <div className="error-box">{error}</div>;

  return (
    <div>
      <h1>{project?.name}</h1>
      <p>{project?.description}</p>

      <section className="section">
        <h3>Members</h3>

        <form onSubmit={handleAddMember} className="small-form">
          <input
            type="email"
            name="email"
            placeholder="Member email"
            value={newMember.email}
            onChange={(e) =>
              setNewMember((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
          <select
            name="role"
            value={newMember.role}
            onChange={(e) =>
              setNewMember((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            <option value="member">Member</option>
            <option value="project_admin">Project Admin</option>
          </select>
          <button type="submit">Add Member</button>
        </form>

        <div className="card-grid small-grid">
          {members.map((member) => (
            <div className="card" key={member.user._id}>
              <h4>{member.user.username}</h4>
              <p>{member.user.fullName || "No full name"}</p>
              <small>Role: {member.role}</small>
              <div className="card-actions">
                <select
                  value={member.role}
                  onChange={(e) =>
                    handleRoleChange(member.user._id, e.target.value)
                  }
                >
                  <option value="member">Member</option>
                  <option value="project_admin">Project Admin</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.user._id)}
                  className="danger-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3>Create Task</h3>
        <form onSubmit={handleCreateTask} className="small-form">
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, title: e.target.value }))
            }
            required
          />
          <textarea
            name="description"
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, description: e.target.value }))
            }
          />
          <select
            name="assignedTo"
            value={newTask.assignedTo}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, assignedTo: e.target.value }))
            }
          >
            <option value="">Unassigned</option>
            {members.map((member) => (
              <option key={member.user._id} value={member.user._id}>
                {member.user.username}
              </option>
            ))}
          </select>
          <select
            name="status"
            value={newTask.status}
            onChange={(e) =>
              setNewTask((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button type="submit">Create Task</button>
        </form>

        <div className="card-grid small-grid">
          {tasks.map((task) => (
            <div className="card" key={task._id}>
              <h4>{task.title}</h4>
              <p>{task.description}</p>
              <small>
                Assigned to: {task.assignedTo?.username || "Unassigned"}
              </small>
              <div className="card-actions">
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleUpdateTaskStatus(task._id, e.target.value)
                  }
                >
                  <option value="todo">Todo</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleDeleteTask(task._id)}
                  className="danger-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3>Notes</h3>
        <form onSubmit={handleCreateNote} className="small-form">
          <textarea
            name="content"
            placeholder="Write a note for this project"
            value={newNote.content}
            onChange={(e) =>
              setNewNote((prev) => ({ ...prev, content: e.target.value }))
            }
            required
          />
          <button type="submit">Create Note</button>
        </form>

        <div className="card-grid small-grid">
          {notes.map((note) => (
            <div className="card" key={note._id}>
              <p>{note.content}</p>
              <small>By {note.createdBy?.username}</small>
              <button
                type="button"
                onClick={() => handleDeleteNote(note._id)}
                className="danger-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProjectDetailsPage;
