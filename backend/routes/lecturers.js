import express from "express";
import db from "../config/db.js";
import {
    getLecturers,
    addLecturer,
    updateLecturer,
    deleteLecturer,
    exportLecturersExcel
} from "../controllers/Lecturers.js";

const router = express.Router();

router.get("/", getLecturers);
router.post("/", addLecturer);
router.put("/:id", updateLecturer);
router.delete("/:id", deleteLecturer);
router.get("/export", exportLecturersExcel);


// GET all lecturers
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, lecturer_name AS name, email, department FROM lecturers");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new lecturer
router.post("/", async(req, res) => {
    try {
        const { lecturer_name, email, department } = req.body;
        if (!lecturer_name || !email || !department)
            return res.status(400).json({ error: "All fields required" });

        const [result] = await db.execute(
            "INSERT INTO lecturers (lecturer_name, email, department) VALUES (?, ?, ?)", [lecturer_name, email, department]
        );
        res.json({ id: result.insertId, lecturer_name, email, department });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT update lecturer
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { lecturer_name, email, department } = req.body;
        await db.execute(
            "UPDATE lecturers SET lecturer_name = ?, email = ?, department = ? WHERE id = ?", [lecturer_name, email, department, id]
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