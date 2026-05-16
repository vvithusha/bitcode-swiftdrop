import apiClient from './client';

export const fetchEvents = () => apiClient.get('/events');
export const fetchEvent = (id) => apiClient.get(`/events/${id}`);
