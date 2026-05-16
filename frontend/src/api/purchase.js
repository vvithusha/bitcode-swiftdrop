import apiClient from './client';

export const purchaseItem = (itemId) => apiClient.post('/purchase', { itemId });
export const confirmOrder = (orderId) => apiClient.post(`/purchase/${orderId}/confirm`);
export const cancelOrder = (orderId) => apiClient.post(`/purchase/${orderId}/cancel`);
