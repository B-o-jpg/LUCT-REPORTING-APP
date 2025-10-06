import db from "../config/db.js";
import { exportToExcel } from "../utils/Excel.js";

export const getLecturers = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM lecturers");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addLecturer = async(req, res) => {
    const { name, email, course_id } = req.body;
    try {
        await db.query("INSERT INTO lecturers (name, email, course_id) VALUES (?, ?, ?)", [name, email, course_id]);
        res.json({ message: "Lecturer added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateLecturer = async(req, res) => {
    const { id } = req.params;
    const { name, email, course_id } = req.body;
    try {
        await db.query("UPDATE lecturers SET name=?, email=?, course_id=? WHERE id=?", [name, email, course_id, id]);
        res.json({ message: "Lecturer updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteLecturer = async(req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM lecturers WHERE id=?", [id]);
        res.json({ message: "Lecturer deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const exportLecturersExcel = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM lecturers");
        const buffer = exportToExcel(rows, "Lecturers");
        res.setHeader("Content-Disposition", "attachment; filename=lecturers.xlsx");
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};