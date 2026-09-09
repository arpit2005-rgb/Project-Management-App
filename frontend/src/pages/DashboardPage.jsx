import { useEffect, useState } from "react";
import axios from "axios";

function DashboardPage({ user }) {
  const [stats, setStats] = useState({ projects: 0, tasks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectsRes = await axios.get("/projects");
        const projects = projectsRes.data.data;

        let totalTasks = 0;

        if (projects.length > 0) {
          const firstProjectId = projects[0]?.project?._id;

          if (firstProjectId) {
            const tasksRes = await axios.get(`/tasks/${firstProjectId}`);
            totalTasks = tasksRes.data.data.length;
          }
        }

        setStats({
          projects: projects.length,
          tasks: totalTasks,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Welcome</h3>
            <p>{user?.username}</p>
          </div>
          <div className="stat-card">
            <h3>Projects</h3>
            <p>{stats.projects}</p>
          </div>
          <div className="stat-card">
            <h3>Tasks</h3>
            <p>{stats.tasks}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
