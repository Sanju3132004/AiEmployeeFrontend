import api from './api';

export const registerUser = (data) => api.post('/api/auth/register', data);

export const registerOwner = (data) => api.post('/api/auth/register-owner', data);

export const loginUser = async (data) => {
  const response = await api.post('/api/auth/login', data);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('email', response.data.email);
  localStorage.setItem('role', response.data.role);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
};

export const getCurrentUser = () => api.get('/api/employees/me');

export const isLoggedIn = () => !!localStorage.getItem('token');

export const getRole = () => localStorage.getItem('role');

export const isAdminOrManager = () => ['ADMIN', 'PROJECT_MANAGER', 'HR'].includes(getRole());

export const forgotPassword = (email) => api.post('/api/auth/forgot-password', { email });

export const resetPassword = (token, newPassword) =>
  api.post('/api/auth/reset-password', { token, newPassword });
