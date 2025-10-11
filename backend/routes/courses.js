import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET all courses
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, name, code, lecturer_id FROM courses");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch courses" });
    }
});

// POST new course
router.post("/", async(req, res) => {
    try {
        const { name, code, lecturer_id } = req.body;
        if (!name || !code || !lecturer_id) return res.status(400).json({ error: "All fields required" });

        const [result] = await db.execute(
            "INSERT INTO courses (name, code, lecturer_id) VALUES (?, ?, ?)", [name, code, lecturer_id]
        );
        res.json({ id: result.insertId, name, code, lecturer_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add course" });
    }
});

// PUT update course
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { name, code, lecturer_id } = req.body;
        await db.execute(
            "UPDATE courses SET name = ?, code = ?, lecturer_id = ? WHERE id = ?", [name, code, lecturer_id, id]
        );
        res.json({ message: "Course updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update course" });
    }
});

// DELETE course
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM courses WHERE id = ?", [id]);
        res.json({ message: "Course deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete course" });
    }
});

export default router;