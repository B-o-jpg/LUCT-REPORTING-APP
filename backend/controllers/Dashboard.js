import db from "../config/db.js";

export const getDashboardStats = async(req, res) => {
    try {
        // Fetch counts for dashboard cards
        const [
            [studentCount]
        ] = await db.query("SELECT COUNT(*) AS count FROM students");
        const [
            [lecturerCount]
        ] = await db.query("SELECT COUNT(*) AS count FROM lecturers");
        const [
            [courseCount]
        ] = await db.query("SELECT COUNT(*) AS count FROM courses");
        const [
            [classCount]
        ] = await db.query("SELECT COUNT(*) AS count FROM classes");
        const [
            [reportCount]
        ] = await db.query("SELECT COUNT(*) AS count FROM reports");

        // Optional: example of graph data (students per course)
        const [studentsPerCourse] = await db.query(`
      SELECT c.name AS course, COUNT(s.id) AS students
      FROM courses c
      LEFT JOIN students s ON s.course_id = c.id
      GROUP BY c.id
    `);

        res.json({
            cards: {
                students: studentCount.count,
                lecturers: lecturerCount.count,
                courses: courseCount.count,
                classes: classCount.count,
                reports: reportCount.count
            },
            graphs: {
                studentsPerCourse
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};