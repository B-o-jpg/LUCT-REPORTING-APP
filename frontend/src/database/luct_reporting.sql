DROP DATABASE IF EXISTS luct_reporting;
CREATE DATABASE luct_reporting;
USE luct_reporting;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student','lecturer','prl','pl') NOT NULL
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_name VARCHAR(50) NOT NULL,
    course VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE lecturers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lecturer_name VARCHAR(50) NOT NULL,
    faculty VARCHAR(100) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    lecturer_id INT,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE SET NULL
);

CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    course_id INT NOT NULL,
    lecturer_id INT NOT NULL,
    scheduled_time DATETIME,
    venue VARCHAR(100),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lecturer_id INT NOT NULL,
    class_id INT NOT NULL,
    week INT NOT NULL,
    date_of_lecture DATE NOT NULL,
    topic VARCHAR(255),
    learning_outcomes TEXT,
    recommendations TEXT,
    actual_students INT,
    total_students INT,
    FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE lecturer_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lecturer_id INT NOT NULL,
  student_id INT NOT NULL,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  feedback TEXT,
  date_rated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE monitoring_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lecturer_id INT NOT NULL,
  class_id INT NOT NULL,
  monitored_by VARCHAR(100) NOT NULL,
  date_monitored DATE NOT NULL,
  performance VARCHAR(100),
  notes TEXT,
  FOREIGN KEY (lecturer_id) REFERENCES lecturers(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
);

CREATE TABLE monitoring (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_name VARCHAR(100),
    class_name VARCHAR(100),
    week INT,
    date_of_lecture DATE,
    course_name VARCHAR(100),
    course_code VARCHAR(20),
    lecturer_name VARCHAR(100),
    actual_students INT,
    total_students INT,
    venue VARCHAR(100),
    scheduled_time VARCHAR(50),
    topic VARCHAR(255),
    learning_outcomes TEXT,
    recommendations TEXT
);

INSERT INTO users (name, email, password, role) VALUES
('Boitumelo Mpelane', 'boitumelo@luct.ac.ls', 'boity123', 'student'),
('John Cena', 'johncena@luct.ac.ls', 'cena123', 'student'),
('Judith Konyana', 'judith@luct.ac.ls', 'judith123', 'student'),
('Lineo Nkeane', 'lineon@luct.ac.ls', 'lineo123', 'student'),
('Lineo Lekoala', 'lineol@luct.ac.ls', 'lineo456', 'student'),
('Nthati Bolae', 'nthati@luct.ac.ls', 'nthati123', 'student'),

('Mr. Talasi', 'talasi@luct.ac.ls', 'talasi123', 'lecturer'),
('Mr. Thokoane', 'thokoane@luct.ac.ls', 'thokoane123', 'lecturer'),
('Mr. Mofolo', 'mofolo@luct.ac.ls', 'mofolo123', 'lecturer'),
('Mrs. Molapo', 'molapo@luct.ac.ls', 'molapo123', 'lecturer'),

('Dr. P', 'prl@luct.ac.ls', 'prl123', 'prl'),
('Dr. B', 'pl@luct.ac.ls', 'pl123', 'pl');

INSERT INTO students (user_id, student_name, course) VALUES
(1, 'Boitumelo Mpelane', 'BSc IT'),
(2, 'John Cena', 'Diploma in Business IT'),
(3, 'Judith Konyana', 'BSc Business IT'),
(4, 'Lineo Nkeane', 'Diploma in IT'),
(5, 'Nthati Bolae', 'Diploma in Business IT'),
(6, 'Lineo Lekoala', 'BSc Business IT');

INSERT INTO lecturers (user_id, lecturer_name, faculty) VALUES
(7,'Mr. Talasi', 'FICT'),
(8,'Mr. Thokoane', 'FICT'),
(9,'Mr. Mofolo', 'FICT'),
(10,'Mrs. Molapo', 'FICT');

INSERT INTO courses (name, code, lecturer_id) VALUES
('Programming Fundamentals', 'DIT101', 1),
('Database Systems', 'DBS201', 2),
('Software Engineering', 'SWE301', 3),
('Business IT Management', 'BIT401', 4);

INSERT INTO classes (name, course_id, lecturer_id, scheduled_time, venue) VALUES
('DIT101 - Class A', 1, 1, '2025-09-29 10:00:00', 'MM4'),
('DBS201 - Class B', 2, 2, '2025-09-30 12:00:00', 'MM7'),
('SWE301 - Class C', 3, 3, '2025-10-01 14:00:00', 'Room 3'),
('BIT401 - Class D', 4, 4, '2025-10-02 09:00:00', 'Hall 1');

INSERT INTO reports (lecturer_id, class_id, week, date_of_lecture, topic, learning_outcomes, recommendations, actual_students, total_students)
VALUES
(1, 1, 1, '2025-09-20', 'Introduction to Programming', 'Understand basics of coding', 'More practice needed', 25, 30),
(2, 2, 1, '2025-09-21', 'ER Models', 'Design entity relationships', 'Revise DB diagrams', 20, 28),
(3, 3, 1, '2025-09-22', 'Software Life Cycle', 'Understand phases of SDLC', 'Group projects suggested', 18, 25),
(4, 4, 1, '2025-09-23', 'Business Strategy', 'Understand IT in business', 'Case studies needed', 22, 27);

ALTER TABLE lecturers ADD COLUMN email VARCHAR(255) NOT NULL;
ALTER TABLE lecturers ADD COLUMN department VARCHAR(255) NOT NULL;
UPDATE lecturers SET email = 'talasi@luct.ac.ls', department = 'Faculty of Information and Communication Technology' WHERE id = 1;
UPDATE lecturers SET email = 'thokoane@luct.ac.ls', department = 'Faculty of Information and Communication Technology' WHERE id = 2;
UPDATE lecturers SET email = 'mofolo@luct.ac.ls', department = 'Faculty of Information and Communication Technology' WHERE id = 3;
UPDATE lecturers SET email = 'molapo@luct.ac.ls', department = 'Faculty of Information and Communication Technology' WHERE id = 4;

ALTER TABLE lecturer_ratings
ADD COLUMN rating_value DECIMAL(3,2) AFTER lecturer_id,
ADD COLUMN comments TEXT AFTER rating_value;
INSERT INTO lecturer_ratings (lecturer_id, student_id, rating_value, comments) VALUES
(1, 2, 4.5, 'Engaging lessons!'),
(2, 4, 4.0, 'Good pace and clear examples.'),
(3, 1, 5, 'Calm and good tutoring'),
(4, 3, 5, 'Best lecturing and clear notes.');

ALTER TABLE lecturer_ratings
ADD COLUMN lecturer_name VARCHAR(255) AFTER lecturer_id;

UPDATE lecturer_ratings r
JOIN lecturers l ON r.lecturer_id = l.id
SET r.lecturer_name = l.lecturer_name;