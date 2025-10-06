import express from "express";
import db from "../config/db.js"; // your MySQL connection
import { getDashboardStats } from "../controllers/Dashboard.js";

const router = express.Router();

router.get("/", getDashboardStats);


// GET /dashboard-counts
router.get("/", async(req, res) => {
    try {
        const [students] = await db.query("SELECT COUNT(*) AS totalStudents FROM students");
        const [lecturers] = await db.query("SELECT COUNT(*) AS totalLecturers FROM lecturers");
        const [courses] = await db.query("SELECT COUNT(*) AS totalCourses FROM courses");
        const [classes] = await db.query("SELECT COUNT(*) AS totalClasses FROM classes");
        const [reports] = await db.query("SELECT COUNT(*) AS totalReports FROM reports");

        res.json({
            totalStudents: students[0].totalStudents,
            totalLecturers: lecturers[0].totalLecturers,
            totalCourses: courses[0].totalCourses,
            totalClasses: classes[0].totalClasses,
            totalReports: reports[0].totalReports,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch dashboard counts" });
    }
});

export default router;