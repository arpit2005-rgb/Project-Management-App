import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import TasksPage from "./pages/TasksPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./components/Layout";

const DEFAULT_API_ORIGIN = import.meta.env.PROD
  ? "https://project-management-backend-three-kappa.vercel.app"
  : "http://localhost:8000";

const API_ORIGIN = (
  import.meta.env.VITE_API_BASE_URL || DEFAULT_API_ORIGIN
).replace(/\/+$/, "");

const API_BASE = `${API_ORIGIN}/api/v1`;

axios.defaults.baseURL = API_BASE;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  if (config.withCredentials === undefined) {
    config.withCredentials = true;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        await axios.post("/auth/refresh-token");
        return axios(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.post("/auth/current-user");
        setUser(res.data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) {
    return <div className="page-center">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/"
        element={
          user ? (
            <Layout user={user} setUser={setUser} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<DashboardPage user={user} />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route
          path="profile"
          element={<ProfilePage user={user} setUser={setUser} />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
