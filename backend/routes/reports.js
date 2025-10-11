import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET all reports
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute(`
      SELECT id, lecturer_id, class_id, week, date_of_lecture, topic, 
             learning_outcomes, recommendations, actual_students, total_students
      FROM reports
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});

// POST new report
router.post("/", async(req, res) => {
    try {
        const {
            lecturer_id,
            class_id,
            week,
            date_of_lecture,
            topic,
            learning_outcomes,
            recommendations,
            actual_students,
            total_students,
        } = req.body;

        if (!lecturer_id || !class_id || !week || !date_of_lecture || !topic) {
            return res.status(400).json({ error: "Required fields missing" });
        }

        const [result] = await db.execute(
            `INSERT INTO reports
        (lecturer_id, class_id, week, date_of_lecture, topic, learning_outcomes, recommendations, actual_students, total_students)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                lecturer_id,
                class_id,
                week,
                date_of_lecture,
                topic,
                learning_outcomes || "",
                recommendations || "",
                actual_students || 0,
                total_students || 0,
            ]
        );

        res.json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to add report" });
    }
});

// PUT update report
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const {
            lecturer_id,
            class_id,
            week,
            date_of_lecture,
            topic,
            learning_outcomes,
            recommendations,
            actual_students,
            total_students,
        } = req.body;

        await db.execute(
            `UPDATE reports SET
        lecturer_id = ?, class_id = ?, week = ?, date_of_lecture = ?, topic = ?,
        learning_outcomes = ?, recommendations = ?, actual_students = ?, total_students = ?
       WHERE id = ?`, [
                lecturer_id,
                class_id,
                week,
                date_of_lecture,
                topic,
                learning_outcomes || "",
                recommendations || "",
                actual_students || 0,
                total_students || 0,
                id,
            ]
        );

        res.json({ message: "Report updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update report" });
    }
});

// DELETE report
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM reports WHERE id = ?", [id]);
        res.json({ message: "Report deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete report" });
    }
});

export default router;