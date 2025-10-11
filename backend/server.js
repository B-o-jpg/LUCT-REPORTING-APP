// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js"; // relative import
import authRoutes from "./routes/auth.js";

// Other routes
import studentsRoutes from "./routes/students.js";
import lecturersRoutes from "./routes/lecturers.js";
import coursesRoutes from "./routes/courses.js";
import classesRoutes from "./routes/classes.js";
import reportsRoutes from "./routes/reports.js";
import usersRoutes from "./routes/users.js";
import dashboardRoutes from "./routes/dashboard.js";
import monitoringRoutes from "./routes/monitoring.js";
import ratingRoutes from "./routes/rating.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/", (req, res) => res.send("✅ Backend is running"));

// API routes
app.use("/api/students", studentsRoutes);
app.use("/api/lecturers", lecturersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/monitoring", monitoringRoutes);
app.use("/api/rating", ratingRoutes);

// Auth routes
app.use("/auth", authRoutes);

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));