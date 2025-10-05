import axios from "axios";

const API_BASE = "http://localhost:4000"; // your backend URL

// --- Dashboard ---
export const fetchDashboardCounts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/dashboard-counts`);
    return res.data;
  } catch (err) {
    console.error(err);
    return {};
  }
};

// --- Students ---
export const fetchStudents = async () => {
  const res = await axios.get(`${API_BASE}/students`);
  return res.data;
};

export const addStudent = async (student) => {
  const res = await axios.post(`${API_BASE}/students`, student);
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await axios.delete(`${API_BASE}/students/${id}`);
  return res.data;
};

// --- Lecturers ---
export const fetchLecturers = async () => {
  const res = await axios.get(`${API_BASE}/lecturers`);
  return res.data;
};

export const addLecturer = async (lecturer) => {
  const res = await axios.post(`${API_BASE}/lecturers`, lecturer);
  return res.data;
};

export const deleteLecturer = async (id) => {
  const res = await axios.delete(`${API_BASE}/lecturers/${id}`);
  return res.data;
};

// --- Courses ---
export const fetchCourses = async () => {
  const res = await axios.get(`${API_BASE}/courses`);
  return res.data;
};

export const addCourse = async (course) => {
  const res = await axios.post(`${API_BASE}/courses`, course);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await axios.delete(`${API_BASE}/courses/${id}`);
  return res.data;
};

// --- Classes ---
export const fetchClasses = async () => {
  const res = await axios.get(`${API_BASE}/classes`);
  return res.data;
};

export const addClass = async (cls) => {
  const res = await axios.post(`${API_BASE}/classes`, cls);
  return res.data;
};

export const deleteClass = async (id) => {
  const res = await axios.delete(`${API_BASE}/classes/${id}`);
  return res.data;
};

// --- Reports ---
export const fetchReports = async () => {
  const res = await axios.get(`${API_BASE}/reports`);
  return res.data;
};

export const addReport = async (report) => {
  const res = await axios.post(`${API_BASE}/reports`, report);
  return res.data;
};

export const deleteReport = async (id) => {
  const res = await axios.delete(`${API_BASE}/reports/${id}`);
  return res.data;
};

// --- User Authentication ---
export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
};

export const registerUser = async (user) => {
  const res = await axios.post(`${API_BASE}/auth/register`, user);
  return res.data;
};
