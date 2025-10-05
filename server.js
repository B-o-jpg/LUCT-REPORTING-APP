import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routers
import studentsRoutes from "./routes/students.js";
import lecturersRoutes from "./routes/lecturers.js";
import coursesRoutes from "./routes/courses.js";
import classesRoutes from "./routes/classes.js";
import reportsRoutes from "./routes/reports.js";
import dashboardRoutes from "./routes/dashboard.js";
import usersRoutes from "./routes/users.js";

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
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);

// Auth routes (simple login example)
import bcrypt from "bcryptjs";
import db from "./db.js";

// Login
app.post("/api/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Missing email/password" });

        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        res.json({
            message: "Login successful",
            user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));