import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/", async(req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                u.name AS lecturer_name,
                COUNT(r.id) AS total_ratings,
                AVG(r.rating) AS avg_rating
            FROM lecturers l
            JOIN users u ON l.user_id = u.id
            LEFT JOIN lecturer_ratings r ON r.lecturer_id = l.id
            GROUP BY l.id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching monitoring data" });
    }
});

export default router;