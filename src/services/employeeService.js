import api from './api';

// Leave
export const applyLeave = (data) => api.post('/api/leaves', data);
export const getMyLeaves = () => api.get('/api/leaves/me');

// Attendance
export const checkIn = () => api.post('/api/attendance/check-in');
export const checkOut = () => api.post('/api/attendance/check-out');
export const getMyAttendance = () => api.get('/api/attendance/me');

// Payroll
export const getMyPayslips = () => api.get('/api/payroll/me');
export const generatePayslip = (data) => api.post('/api/payroll/admin/generate', data);

// Admin
export const listAllEmployees = () => api.get('/api/admin/employees');

// AI Chatbot
export const askChatbot = (message) => api.post('/api/chatbot/ask', { message });
