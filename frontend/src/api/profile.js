import apiClient from './client';

export const fetchProfile = () => apiClient.get('/profile');
export const updateProfile = (payload) => apiClient.put('/profile', payload);
export const fetchOrders = () => apiClient.get('/profile/orders');
