import express from "express";
import db from "../db.js";
const router = express.Router();

// GET dashboard counts
router.get("/", async(req, res) => {
    try {
        const [
            [students]
        ] = await db.execute("SELECT COUNT(*) AS total FROM students");
        const [
            [lecturers]
        ] = await db.execute("SELECT COUNT(*) AS total FROM lecturers");
        const [
            [courses]
        ] = await db.execute("SELECT COUNT(*) AS total FROM courses");
        const [
            [classes]
        ] = await db.execute("SELECT COUNT(*) AS total FROM classes");
        const [
            [reports]
        ] = await db.execute("SELECT COUNT(*) AS total FROM reports");

        res.json({
            totalStudents: students.total,
            totalLecturers: lecturers.total,
            totalCourses: courses.total,
            totalClasses: classes.total,
            totalReports: reports.total,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;