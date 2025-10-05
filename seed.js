import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

async function run() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "luct_reporting",
    });
    console.log("✅ Connected to database");

    // 1️⃣ Faculties
    const [facultyRes] = await db.execute(
        "INSERT INTO faculties (name) VALUES (?)", ["Faculty of Information Communication Technology"]
    );
    const facultyId = facultyRes.insertId;

    // 2️⃣ Courses
    const courses = [
        ["Diploma in Information Technology", "DIT101"],
        ["Diploma in Business Information Technology", "DBIT101"],
        ["BSc Degree in Business Information Technology", "BSCBIT101"],
    ];
    const courseIds = [];
    for (const [name, code] of courses) {
        const [res] = await db.execute("INSERT INTO courses (name, code) VALUES (?, ?)", [name, code]);
        courseIds.push(res.insertId);
    }

    // 3️⃣ Classes
    const classesArr = [
        ["Class A"],
        ["Class B"],
    ];
    const classIds = [];
    for (const [name] of classesArr) {
        const [res] = await db.execute(
            "INSERT INTO classes (name, faculty_id, scheduled_time, venue) VALUES (?, ?, ?, ?)", [name, facultyId, "08:00 - 10:00", "Room 101"]
        );
        classIds.push(res.insertId);
    }

    // 4️⃣ Lecturers
    const lecturers = [
        ["Mr. Talasi", "talasi@luct.ac.ls", "ICT"],
        ["Mr. Thokoane", "thokoane@luct.ac.ls", "ICT"],
        ["Mr. Mofolo", "mofolo@luct.ac.ls", "Business"],
        ["Mrs. Molapo", "molapo@luct.ac.ls", "Business"],
    ];
    const lecturerIds = [];
    for (const [name, email, department] of lecturers) {
        const [res] = await db.execute(
            "INSERT INTO lecturers (lecturer_name, email, department) VALUES (?, ?, ?)", [name, email, department]
        );
        lecturerIds.push(res.insertId);
    }

    // 5️⃣ Users: Students
    const students = [
        ["Boitumelo Mpelane", "boitumelo@students.luct", "Boitu123!", "student", courseIds[0], classIds[0]],
        ["John Cena", "john.cena@students.luct", "CenaRule#1", "student", courseIds[1], classIds[0]],
        ["Judith Konyana", "judith@students.luct", "JudithK!", "student", courseIds[1], classIds[1]],
        ["Lineo Nkeane", "lineo.n@students.luct", "LineoN2025", "student", courseIds[0], classIds[1]],
        ["Lineo Lekoala", "lineo.l@students.luct", "Lekoala!22", "student", courseIds[2], classIds[0]],
        ["Nthati Bolae", "nthati@students.luct", "NthatiB#7", "student", courseIds[2], classIds[1]],
    ];

    for (const [full_name, email, rawPass, role, courseId, classId] of students) {
        const hashed = await bcrypt.hash(rawPass, 10);
        await db.execute(
            "INSERT INTO users (full_name, email, password, role, course_id, class_id) VALUES (?, ?, ?, ?, ?, ?)", [full_name, email, hashed, role, courseId, classId]
        );
    }

    // 6️⃣ Users: Lecturers
    for (let i = 0; i < lecturers.length; i++) {
        const [name, email] = lecturers[i];
        const rawPass = name.split(" ")[1] + "2025"; // e.g., Talasi2025
        const hashed = await bcrypt.hash(rawPass, 10);
        await db.execute(
            "INSERT INTO users (full_name, email, password, role, lecturer_id) VALUES (?, ?, ?, ?, ?)", [name, email, hashed, "lecturer", lecturerIds[i]]
        );
    }

    // 7️⃣ Reports (optional sample)
    const [studentRows] = await db.execute("SELECT id FROM students");
    const [classRows] = await db.execute("SELECT id FROM classes");
    for (let i = 0; i < studentRows.length; i++) {
        await db.execute(
            "INSERT INTO reports (student_id, class_id, grade, comments) VALUES (?, ?, ?, ?)", [studentRows[i].id, classRows[i % classRows.length].id, Math.floor(Math.random() * 41) + 60, "Sample report"]
        );
    }

    console.log("✅ Seed completed successfully");
    process.exit(0);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});