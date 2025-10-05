import express from "express";
import db from "../config/db.js";

const router = express.Router();

// Get all ratings
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.*, l.id AS lecturer_id, u.name AS lecturer_name
            FROM lecturer_ratings r
            JOIN lecturers l ON r.lecturer_id = l.id
            JOIN users u ON l.user_id = u.id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching ratings" });
    }
});

// Add new rating
router.post("/", async(req, res) => {
    const { lecturer_id, student_id, rating, comment } = req.body;
    try {
        await db.query(
            "INSERT INTO lecturer_ratings (lecturer_id, student_id, rating, comment) VALUES (?, ?, ?, ?)", [lecturer_id, student_id, rating, comment]
        );
        res.json({ message: "Rating added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding rating" });
    }
});

// Delete rating
router.delete("/:id", async(req, res) => {
    try {
        await db.query("DELETE FROM lecturer_ratings WHERE id = ?", [req.params.id]);
        res.json({ message: "Rating deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting rating" });
    }
});

export default router;