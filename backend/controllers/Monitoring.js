import db from "../config/db.js";

export const getMonitoringData = async(req, res) => {
    try {
        // Example: last 10 reports added
        const [recentReports] = await db.query(`
      SELECT r.id, s.name AS student, l.name AS lecturer, c.name AS class, r.score, r.comment, r.created_at
      FROM reports r
      JOIN students s ON r.student_id = s.id
      JOIN lecturers l ON r.lecturer_id = l.id
      JOIN classes c ON r.class_id = c.id
      ORDER BY r.created_at DESC
      LIMIT 10
    `);

        // Example: recent student registrations
        const [recentStudents] = await db.query(`
      SELECT id, name, email, created_at
      FROM students
      ORDER BY created_at DESC
      LIMIT 10
    `);

        res.json({
            recentReports,
            recentStudents
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};