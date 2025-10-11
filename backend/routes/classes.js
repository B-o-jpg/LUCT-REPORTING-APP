import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET all classes
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT id, name, course_id, lecturer_id, scheduled_time, venue FROM classes"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// POST new class
router.post("/", async(req, res) => {
    const { name, course_id, lecturer_id, scheduled_time, venue } = req.body;
    try {
        const [result] = await db.execute(
            "INSERT INTO classes (name, course_id, lecturer_id, scheduled_time, venue) VALUES (?, ?, ?, ?, ?)", [name, course_id, lecturer_id, scheduled_time, venue]
        );
        res.json({ id: result.insertId, name, course_id, lecturer_id, scheduled_time, venue });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE class
router.delete("/:id", async(req, res) => {
    const { id } = req.params;
    try {
        await db.execute("DELETE FROM classes WHERE id = ?", [id]);
        res.json({ message: "Class deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;