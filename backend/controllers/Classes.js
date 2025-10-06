import db from "../config/db.js";
import { exportToExcel } from "../utils/Excel.js";

export const getClasses = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM classes");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addClass = async(req, res) => {
    const { name, course_id } = req.body;
    try {
        await db.query("INSERT INTO classes (name, course_id) VALUES (?, ?)", [name, course_id]);
        res.json({ message: "Class added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateClass = async(req, res) => {
    const { id } = req.params;
    const { name, course_id } = req.body;
    try {
        await db.query("UPDATE classes SET name=?, course_id=? WHERE id=?", [name, course_id, id]);
        res.json({ message: "Class updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteClass = async(req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM classes WHERE id=?", [id]);
        res.json({ message: "Class deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const exportClassesExcel = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM classes");
        const buffer = exportToExcel(rows, "Classes");
        res.setHeader("Content-Disposition", "attachment; filename=classes.xlsx");
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};