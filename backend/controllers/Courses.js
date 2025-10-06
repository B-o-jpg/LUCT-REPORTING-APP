import db from "../config/db.js";
import { exportToExcel } from "../utils/Excel.js";

export const getCourses = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM courses");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addCourse = async(req, res) => {
    const { name, code } = req.body;
    try {
        await db.query("INSERT INTO courses (name, code) VALUES (?, ?)", [name, code]);
        res.json({ message: "Course added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateCourse = async(req, res) => {
    const { id } = req.params;
    const { name, code } = req.body;
    try {
        await db.query("UPDATE courses SET name=?, code=? WHERE id=?", [name, code, id]);
        res.json({ message: "Course updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteCourse = async(req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM courses WHERE id=?", [id]);
        res.json({ message: "Course deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const exportCoursesExcel = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM courses");
        const buffer = exportToExcel(rows, "Courses");
        res.setHeader("Content-Disposition", "attachment; filename=courses.xlsx");
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};