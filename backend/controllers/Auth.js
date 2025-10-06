import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async(req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hashed, role]
        );
        res.json({ message: "User registered successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async(req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
        if (!rows.length) return res.status(400).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, rows[0].password);
        if (!valid) return res.status(400).json({ error: "Invalid password" });

        const token = jwt.sign({ id: rows[0].id, role: rows[0].role }, "secretkey", { expiresIn: "1d" });
        res.json({ token, user: rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};