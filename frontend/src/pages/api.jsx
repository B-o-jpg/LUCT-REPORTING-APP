import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // change if your backend path differs
  timeout: 10000,
});

// Dashboard & monitoring
export const fetchDashboard = () => api.get("/dashboard");
export const fetchMonitoring = () => api.get("/monitoring");

// Students
export const fetchStudents = () => api.get("/students");
export const addStudent = (payload) => api.post("/students", payload);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// Lecturers
export const fetchLecturers = () => api.get("/lecturers");
export const addLecturer = (payload) => api.post("/lecturers", payload);

// Classes
export const fetchClasses = () => api.get("/classes");
export const addClass = (payload) => api.post("/classes", payload);

// Courses
export const fetchCourses = () => api.get("/courses");

// Reports
export const fetchReports = () => api.get("/reports");
export const addReport = (payload) => api.post("/reports", payload);

// Ratings
export const fetchRatings = () => api.get("/ratings");
export const submitRating = (payload) => api.post("/ratings", payload);

// Auth
export const login = (payload) => api.post("/auth/login", payload);
export const register = (payload) => api.post("/auth/register", payload);

// Generic export helper — frontend will fetch data then convert to xlsx
export default api;
