import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ----------------------------
// GET all students
// ----------------------------
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT id, user_id, student_name, course FROM students"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch students" });
    }
});

// ----------------------------
// POST new student
// ----------------------------
router.post("/", async(req, res) => {
    try {
        const { user_id, student_name, course } = req.body;
        if (!user_id || !student_name || !course)
            return res.status(400).json({ error: "All fields required" });

        const [result] = await db.execute(
            "INSERT INTO students (user_id, student_name, course) VALUES (?, ?, ?)", [user_id, student_name, course]
        );

        res.json({ id: result.insertId, user_id, student_name, course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add student" });
    }
});

// ----------------------------
// PUT update student
// ----------------------------
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { user_id, student_name, course } = req.body;
        if (!user_id || !student_name || !course)
            return res.status(400).json({ error: "All fields required" });

        await db.execute(
            "UPDATE students SET user_id = ?, student_name = ?, course = ? WHERE id = ?", [user_id, student_name, course, id]
        );

        res.json({ message: "Student updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update student" });
    }
});

// ----------------------------
// DELETE student
// ----------------------------
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM students WHERE id = ?", [id]);
        res.json({ message: "Student deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete student" });
    }
});

export default router;