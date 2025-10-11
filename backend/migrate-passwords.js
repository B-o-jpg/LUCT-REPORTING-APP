// migrate-passwords.js
import db from "./config/db.js"; // path to your db.js
import bcrypt from "bcryptjs"; // use bcryptjs instead of bcrypt

(async() => {
    try {
        console.log("Starting password migration...");

        // Fetch all users
        const [rows] = await db.query("SELECT id, name, password FROM users");

        for (const row of rows) {
            const { id, name, password } = row;

            // Check if password is already hashed
            if (typeof password === "string" && !password.startsWith("$2")) {
                // Hash the plain-text password
                const hashed = await bcrypt.hash(password, 10);

                // Update the database
                await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, id]);

                console.log(`✅ Migrated password for user: ${name}`);
            } else {
                console.log(`⏩ Skipped already hashed password for user: ${name}`);
            }
        }

        console.log("🎉 Password migration complete!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error migrating passwords:", err);
        process.exit(1);
    }
})();