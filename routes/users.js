import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = express.Router();

// GET all users
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.execute("SELECT id, full_name, email, role FROM users");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single user by ID
router.get("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.execute("SELECT id, full_name, email, role FROM users WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ error: "User not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE new user
router.post("/", async(req, res) => {
    try {
        const { full_name, email, password, role } = req.body;
        if (!full_name || !email || !password || !role) return res.status(400).json({ error: "All fields required" });

        // Check if email exists
        const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ error: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)", [full_name, email, hashed, role]
        );
        res.json({ id: result.insertId, full_name, email, role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE user
router.put("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, password, role } = req.body;

        // If password is provided, hash it
        let query, params;
        if (password) {
            const hashed = await bcrypt.hash(password, 10);
            query = "UPDATE users SET full_name = ?, email = ?, password = ?, role = ? WHERE id = ?";
            params = [full_name, email, hashed, role, id];
        } else {
            query = "UPDATE users SET full_name = ?, email = ?, role = ? WHERE id = ?";
            params = [full_name, email, role, id];
        }

        await db.execute(query, params);
        res.json({ message: "User updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE user
router.delete("/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await db.execute("DELETE FROM users WHERE id = ?", [id]);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;