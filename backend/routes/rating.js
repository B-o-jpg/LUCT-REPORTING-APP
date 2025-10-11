import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET all ratings
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute(
            "SELECT id, lecturer_id, rating_value, comments, student_id, rating, feedback, date_rated FROM lecturer_ratings ORDER BY date_rated DESC"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch ratings" });
    }
});

// POST a new rating
router.post("/", async(req, res) => {
    try {
        const { lecturer_id, rating_value, comments, student_id } = req.body;
        if (!lecturer_id || !rating_value) return res.status(400).json({ error: "Lecturer and rating required" });

        const [result] = await db.execute(
            "INSERT INTO lecturer_ratings (lecturer_id, rating_value, comments, student_id, date_rated) VALUES (?, ?, ?, ?, NOW())", [lecturer_id, rating_value, comments || "", student_id || null]
        );

        res.json({ id: result.insertId, lecturer_id, rating_value, comments, student_id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add rating" });
    }
});

export default router;