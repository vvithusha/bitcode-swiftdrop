import apiClient from './client';

export const fetchAdminDashboard = () => apiClient.get('/admin/events');
export const createEvent = (payload) => apiClient.post('/admin/events', payload);
export const updateEvent = (eventId, payload) => apiClient.put(`/admin/events/${eventId}`, payload);
export const updateEventStatus = (eventId, payload) => apiClient.put(`/admin/events/${eventId}/status`, payload);
export const fetchUsers = (page = 1, pageSize = 20) => apiClient.get(`/admin/users?page=${page}&pageSize=${pageSize}`);
export const deactivateUser = (id) => apiClient.put(`/admin/users/${id}/deactivate`);
