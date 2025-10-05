import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 🟢 Get all classes
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT 
        classes.id,
        classes.name,
        courses.name AS course_name,
        lecturers.lecturer_name AS lecturer_name,
        classes.scheduled_time,
        classes.venue
      FROM classes
      JOIN courses ON classes.course_id = courses.id
      JOIN lecturers ON classes.lecturer_id = lecturers.id
    `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🟢 Add a new class
router.post("/", async(req, res) => {
    const { name, course_id, lecturer_id, scheduled_time, venue } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO classes (name, course_id, lecturer_id, scheduled_time, venue) VALUES (?, ?, ?, ?, ?)", [name, course_id, lecturer_id, scheduled_time, venue]
        );
        res.status(201).json({ message: "Class added successfully", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🟢 Delete a class
router.delete("/:id", async(req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM classes WHERE id = ?", [id]);
        res.json({ message: "Class deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 🟢 Update a class
router.put("/:id", async(req, res) => {
    const { id } = req.params;
    const { name, course_id, lecturer_id, scheduled_time, venue } = req.body;
    try {
        await db.query(
            "UPDATE classes SET name = ?, course_id = ?, lecturer_id = ?, scheduled_time = ?, venue = ? WHERE id = ?", [name, course_id, lecturer_id, scheduled_time, venue, id]
        );
        res.json({ message: "Class updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;