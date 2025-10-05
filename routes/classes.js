import express from "express";
import db from "../db.js";
const router = express.Router();

// GET all classes
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, name, faculty_id, scheduled_time, venue FROM classes");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new class
router.post("/", async(req, res) => {
    try {
        const { name, faculty_id, scheduled_time, venue } = req.body;
        if (!name || !faculty_id || !scheduled_time || !venue)
            return res.status(400).json({ error: "All fields required" });

        const [result] = await db.execute(
            "INSERT INTO classes (name, faculty_id, scheduled_time, venue) VALUES (?, ?, ?, ?)", [name, faculty_id, scheduled_time, venue]
        );
        res.json({ id: result.insertId, name, faculty_id, scheduled_time, venue });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update class
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { name, faculty_id, scheduled_time, venue } = req.body;
        await db.execute(
            "UPDATE classes SET name = ?, faculty_id = ?, scheduled_time = ?, venue = ? WHERE id = ?", [name, faculty_id, scheduled_time, venue, id]
        );
        res.json({ message: "Class updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE class
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM classes WHERE id = ?", [id]);
        res.json({ message: "Class deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;