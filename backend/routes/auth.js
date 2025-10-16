// backend/routes/auth.js
import express from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// --- REGISTER ---
router.post("/register", async(req, res) => {
    const { name, email, password, role } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Check if user already exists
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Default role to "student" if not specified
        const userRole = role || "student";

        // Insert user into database
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, userRole]
        );

        // Fetch the newly inserted user
        const [newUserRows] = await db.query("SELECT id, name, email, role FROM users WHERE id = ?", [result.insertId]);
        const newUser = newUserRows[0];

        // Return user data (so frontend can redirect automatically)
        res.json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// --- LOGIN ---
router.post("/login", async(req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(401).json({ message: "User not found" });

        const user = rows[0];
        let validPassword = false;

        if (user.password.startsWith("$2")) {
            // Hashed password
            validPassword = await bcrypt.compare(password, user.password);
        } else {
            // Plain-text (migrate old passwords)
            validPassword = password === user.password;
            if (validPassword) {
                const hashed = await bcrypt.hash(password, 10);
                await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, user.id]);
                console.log(`✅ Migrated password for user: ${user.name}`);
            }
        }

        if (!validPassword) return res.status(401).json({ message: "Incorrect password" });

        // Return user data
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: err.message });
    }
});

export default router;