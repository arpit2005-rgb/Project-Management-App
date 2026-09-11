import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/database-connection.js";

const app = express();

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://project-management-frontend-flax-eight.vercel.app",
];

const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...new Set([...defaultAllowedOrigins, ...configuredOrigins]),
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  return /^(http|https):\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

//basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//cors configurations
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
});

//import the routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import taskRouter from "./routes/task.routes.js";
import noteRouter from "./routes/note.routes.js";

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/notes", noteRouter);

app.get("/", (req, res) => {
  res.send("Welcome to bootcampy");
});

app.use((err, req, res, next) => {
  console.error("❌ Request failed", {
    method: req.method,
    path: req.originalUrl,
    name: err.name,
    message: err.message,
  });

  const statusCode = err.statusCode || 500;
  const message =
    err.message === "MongoDB connection failed"
      ? "Database connection failed"
      : err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

export default app;
