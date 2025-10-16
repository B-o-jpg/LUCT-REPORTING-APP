// controllers/monitoring.js
import db from "../config/db.js";

export const getMonitoringData = async(req, res) => {
    try {
        const [rows] = await db.query(`
      SELECT *
      FROM monitoring
      ORDER BY date_of_lecture DESC
    `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch monitoring data" });
    }
};