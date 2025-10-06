import db from "../config/db.js";

export const getRatings = async(req, res) => {
    try {
        // Average score per lecturer
        const [lecturerRatings] = await db.query(`
      SELECT l.name AS lecturer, AVG(r.score) AS avgScore
      FROM reports r
      JOIN lecturers l ON r.lecturer_id = l.id
      GROUP BY l.id
    `);

        // Average score per class
        const [classRatings] = await db.query(`
      SELECT c.name AS class, AVG(r.score) AS avgScore
      FROM reports r
      JOIN classes c ON r.class_id = c.id
      GROUP BY c.id
    `);

        // Average score per course
        const [courseRatings] = await db.query(`
      SELECT co.name AS course, AVG(r.score) AS avgScore
      FROM reports r
      JOIN classes c ON r.class_id = c.id
      JOIN courses co ON c.course_id = co.id
      GROUP BY co.id
    `);

        res.json({
            lecturerRatings,
            classRatings,
            courseRatings
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};