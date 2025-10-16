// routes/monitoring.js
import express from "express";
import db from "../config/db.js";

const router = express.Router();

// GET all monitoring
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM monitoring ORDER BY date_of_lecture DESC");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch monitoring data" });
    }
});

// CREATE a monitoring record
router.post("/", async(req, res) => {
    try {
        const payload = req.body;
        const keys = Object.keys(payload).join(", ");
        const values = Object.values(payload);
        const placeholders = values.map(() => "?").join(", ");

        const [result] = await db.execute(
            `INSERT INTO monitoring (${keys}) VALUES (${placeholders})`,
            values
        );
        res.json({ id: result.insertId, ...payload });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create monitoring record" });
    }
});

// UPDATE a monitoring record
router.put("/:id", async(req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        const updates = Object.keys(payload).map(k => `${k}=?`).join(", ");
        const values = [...Object.values(payload), id];

        await db.execute(`UPDATE monitoring SET ${updates} WHERE id=?`, values);
        res.json({ id, ...payload });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update monitoring record" });
    }
});

// DELETE a monitoring record
router.delete("/:id", async(req, res) => {
    try {
        const id = req.params.id;
        await db.execute("DELETE FROM monitoring WHERE id=?", [id]);
        res.json({ message: "Deleted successfully", id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete monitoring record" });
    }
});

export default router;