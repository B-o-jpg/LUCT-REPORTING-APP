import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:4000/api", // adjust if backend path differs
  timeout: 10000,
});

// Get current user from localStorage
const getUser = () => JSON.parse(localStorage.getItem("user"));

// ------------------------
// Dashboard & Monitoring
// ------------------------
export const fetchDashboard = () => {
  const user = getUser();
  return api.get("/dashboard/counts", { params: { userId: user?.id, role: user?.role } });
};

export const fetchMonitoring = () => {
  const user = getUser();
  return api.get("/monitoring", { params: { userId: user?.id, role: user?.role } });
};
// Update a monitoring record
export const addMonitoring = (payload) => api.post("/monitoring", payload);
export const deleteMonitoring = (id) => api.delete(`/monitoring/${id}`);
export const updateMonitoring = (id, payload) => api.put(`/monitoring/${id}`, payload);


// ------------------------
// Students
// ------------------------
export const fetchStudents = () => api.get("/students");
export const addStudent = (payload) => api.post("/students", payload);
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// ------------------------
// Lecturers
// ------------------------
export const fetchLecturers = () => api.get("/lecturers");
export const addLecturer = (payload) => api.post("/lecturers", payload);

// ------------------------
// Classes
// ------------------------
export const fetchClasses = () => api.get("/classes");
export const addClass = (payload) => api.post("/classes", payload);

// ------------------------
// Courses
// ------------------------
export const fetchCourses = () => api.get("/courses");

// ------------------------
// Reports
// ------------------------
export const fetchReports = () => {
  const user = getUser();
  return api.get("/reports", { params: { userId: user?.id, role: user?.role } });
};
export const addReport = (payload) => api.post("/reports", payload);

// ------------------------
// Ratings
// ------------------------
export const fetchRatings = () => {
  const user = getUser();
  return api.get("/ratings", { params: { userId: user?.id, role: user?.role } });
};
export const submitRating = (payload) => api.post("/ratings", payload);

// ------------------------
// Auth
// ------------------------
export const login = (payload) => api.post("/auth/login", payload);
export const register = (payload) => api.post("/auth/register", payload);

// ------------------------
// Generic export helper
// ------------------------
export default api;
