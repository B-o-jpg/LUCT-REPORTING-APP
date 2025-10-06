import db from "../config/db.js";
import { exportToExcel } from "../utils/Excel.js";

export const getStudents = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addStudent = async(req, res) => {
    const { name, email, course_id } = req.body;
    try {
        await db.query("INSERT INTO students (name, email, course_id) VALUES (?, ?, ?)", [name, email, course_id]);
        res.json({ message: "Student added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateStudent = async(req, res) => {
    const { id } = req.params;
    const { name, email, course_id } = req.body;
    try {
        await db.query("UPDATE students SET name=?, email=?, course_id=? WHERE id=?", [name, email, course_id, id]);
        res.json({ message: "Student updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteStudent = async(req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM students WHERE id=?", [id]);
        res.json({ message: "Student deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const exportStudentsExcel = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM students");
        const buffer = exportToExcel(rows, "Students");
        res.setHeader("Content-Disposition", "attachment; filename=students.xlsx");
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};