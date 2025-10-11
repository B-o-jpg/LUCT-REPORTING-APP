import db from "../config/db.js";

// GET all ratings
export const getRatings = async(req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT 
        id,
        lecturer_id,
        rating_value,
        comments,
        student_id,
        date_rated
      FROM lecturer_ratings
      ORDER BY date_rated DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

// POST a new rating
export const submitRating = async(req, res) => {
    try {
        const { lecturer_id, student_id, rating_value, comments } = req.body;
        if (!lecturer_id || !student_id || !rating_value)
            return res.status(400).json({ error: "Lecturer, Student, and Rating are required" });

        const [result] = await db.execute(
            `INSERT INTO lecturer_ratings (lecturer_id, student_id, rating_value, comments, date_rated)
       VALUES (?, ?, ?, ?, NOW())`, [lecturer_id, student_id, rating_value, comments || ""]
        );

        res.json({ id: result.insertId, lecturer_id, student_id, rating_value, comments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};