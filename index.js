import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

// Import routes
import studentsRoutes from "./routes/students.js";
import lecturersRoutes from "./routes/lecturers.js";
import coursesRoutes from "./routes/courses.js";
import classesRoutes from "./routes/classes.js";
import reportsRoutes from "./routes/reports.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();

const app = express(); // ✅ must come first

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/students", studentsRoutes);
app.use("/api/lecturers", lecturersRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});