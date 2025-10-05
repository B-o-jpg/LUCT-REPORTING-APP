import express from "express";
import db from "../db.js";
const router = express.Router();

// GET all students
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, student_name AS name, course FROM students");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new student
router.post("/", async(req, res) => {
    try {
        const { student_name, course } = req.body;
        if (!student_name || !course) return res.status(400).json({ error: "All fields required" });

        const [result] = await db.execute("INSERT INTO students (student_name, course) VALUES (?, ?)", [student_name, course]);
        res.json({ id: result.insertId, student_name, course });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update student
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { student_name, course } = req.body;
        await db.execute("UPDATE students SET student_name = ?, course = ? WHERE id = ?", [student_name, course, id]);
        res.json({ message: "Student updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE student
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM students WHERE id = ?", [id]);
        res.json({ message: "Student deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;