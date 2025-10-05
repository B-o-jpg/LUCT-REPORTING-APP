// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// REGISTER
router.post("/register", async(req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Missing fields" });

        const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) return res.status(400).json({ error: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashed, role || "student"]
        );

        res.json({ message: "Registration successful", userId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// LOGIN
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "Missing email/password" });

        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
        res.json({ message: "Login successful", token, user: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;