import express from "express";
import db from "../config/db.js";
const router = express.Router();

// GET all reports
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT r.id, s.student_name, c.name AS class_name, r.grade, r.comments
            FROM reports r
            JOIN students s ON r.student_id = s.id
            JOIN classes c ON r.class_id = c.id
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new report
router.post("/", async(req, res) => {
    try {
        const { student_id, class_id, grade, comments } = req.body;
        if (!student_id || !class_id || !grade) return res.status(400).json({ error: "Missing required fields" });

        const [result] = await db.execute(
            "INSERT INTO reports (student_id, class_id, grade, comments) VALUES (?, ?, ?, ?)", [student_id, class_id, grade, comments]
        );
        res.json({ id: result.insertId, student_id, class_id, grade, comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update report
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { student_id, class_id, grade, comments } = req.body;
        await db.execute(
            "UPDATE reports SET student_id = ?, class_id = ?, grade = ?, comments = ? WHERE id = ?", [student_id, class_id, grade, comments, id]
        );
        res.json({ message: "Report updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE report
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM reports WHERE id = ?", [id]);
        res.json({ message: "Report deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;