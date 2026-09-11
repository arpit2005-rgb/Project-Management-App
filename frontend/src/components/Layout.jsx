import { NavLink, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { clearAccessToken } from "../auth/session";

function Layout({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      clearAccessToken();
      setUser(null);
      navigate("/login");
    } catch (error) {
      clearAccessToken();
      console.error(error);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Project Camp</div>

        <nav className="nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>

        <div className="sidebar-user">
          <div className="avatar-small">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <strong>{user?.username}</strong>
            <small>{user?.email}</small>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
