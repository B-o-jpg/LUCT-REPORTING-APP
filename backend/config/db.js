import mysql from "mysql2/promise";

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // empty, since XAMPP uses no password by default
    database: "luct_reporting", // make sure this DB exists
});

console.log("✅ Database connected successfully");
export default db;