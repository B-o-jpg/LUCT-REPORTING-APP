// backend/routes/auth.js
import express from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// --- REGISTER ---
router.post("/register", async(req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // Check if user exists by email
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into DB
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, role || "student"]
        );

        res.json({ message: "User registered successfully", userId: result.insertId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- LOGIN ---
router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(401).json({ message: "User not found" });

        const user = rows[0];

        // Check if password is hashed or plain-text
        let validPassword = false;

        if (user.password.startsWith("$2")) {
            // Already hashed
            validPassword = await bcrypt.compare(password, user.password);
        } else {
            // Plain-text password (migrate on first login)
            validPassword = password === user.password;

            if (validPassword) {
                // Hash and update password in DB
                const hashed = await bcrypt.hash(password, 10);
                await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, user.id]);
                console.log(`✅ Migrated password for user: ${user.name}`);
            }
        }

        if (!validPassword) return res.status(401).json({ message: "Incorrect password" });

        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;