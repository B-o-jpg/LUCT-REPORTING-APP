import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET all lecturers
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT id, lecturer_name, faculty, email, department FROM lecturers"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new lecturer
router.post("/", async(req, res) => {
    try {
        const { lecturer_name, faculty, email, department } = req.body;
        if (!lecturer_name || !faculty || !email || !department)
            return res.status(400).json({ error: "All fields required" });

        const [result] = await db.execute(
            "INSERT INTO lecturers (lecturer_name, faculty, email, department) VALUES (?, ?, ?, ?)", [lecturer_name, faculty, email, department]
        );
        res.json({ id: result.insertId, lecturer_name, faculty, email, department });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update lecturer
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { lecturer_name, faculty, email, department } = req.body;
        await db.execute(
            "UPDATE lecturers SET lecturer_name = ?, faculty = ?, email = ?, department = ? WHERE id = ?", [lecturer_name, faculty, email, department, id]
        );
        res.json({ message: "Lecturer updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE lecturer
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM lecturers WHERE id = ?", [id]);
        res.json({ message: "Lecturer deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;