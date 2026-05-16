import { io } from 'socket.io-client';

const baseUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || 'http://localhost';

export const socket = io(baseUrl, {
  withCredentials: true,
  path: '/socket.io'
});
