import express from "express";
import db from "../config/db.js";
import {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    exportCoursesExcel
} from "../controllers/Courses.js";

const router = express.Router();

router.get("/", getCourses);
router.post("/", addCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.get("/export", exportCoursesExcel);



// GET all courses
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, name, code FROM courses");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new course
router.post("/", async(req, res) => {
    try {
        const { name, code } = req.body;
        if (!name || !code) return res.status(400).json({ error: "All fields required" });

        const [result] = await db.execute("INSERT INTO courses (name, code) VALUES (?, ?)", [name, code]);
        res.json({ id: result.insertId, name, code });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update course
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { name, code } = req.body;
        await db.execute("UPDATE courses SET name = ?, code = ? WHERE id = ?", [name, code, id]);
        res.json({ message: "Course updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE course
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM courses WHERE id = ?", [id]);
        res.json({ message: "Course deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;