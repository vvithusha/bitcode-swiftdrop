import apiClient from './client';

export const registerUser = (payload) => apiClient.post('/auth/register', payload);
export const loginUser = (payload) => apiClient.post('/auth/login', payload);
export const logoutUser = () => apiClient.post('/auth/logout');
export const getProfile = () => apiClient.get('/profile');
