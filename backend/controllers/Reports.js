import db from "../config/db.js";
import { exportToExcel } from "../utils/Excel.js";

export const getReports = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reports");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addReport = async(req, res) => {
    const { student_id, class_id, lecturer_id, score, comment } = req.body;
    try {
        await db.query(
            "INSERT INTO reports (student_id, class_id, lecturer_id, score, comment) VALUES (?, ?, ?, ?, ?)", [student_id, class_id, lecturer_id, score, comment]
        );
        res.json({ message: "Report added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateReport = async(req, res) => {
    const { id } = req.params;
    const { student_id, class_id, lecturer_id, score, comment } = req.body;
    try {
        await db.query(
            "UPDATE reports SET student_id=?, class_id=?, lecturer_id=?, score=?, comment=? WHERE id=?", [student_id, class_id, lecturer_id, score, comment, id]
        );
        res.json({ message: "Report updated successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteReport = async(req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM reports WHERE id=?", [id]);
        res.json({ message: "Report deleted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const exportReportsExcel = async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reports");
        const buffer = exportToExcel(rows, "Reports");
        res.setHeader("Content-Disposition", "attachment; filename=reports.xlsx");
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};