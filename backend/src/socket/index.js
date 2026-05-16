const { Server } = require('socket.io');

let ioInstance;

const initSocket = (httpServer) => {
  if (ioInstance) {
    return ioInstance;
  }

  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

  ioInstance = new Server(httpServer, {
    cors: {
      origin: corsOrigin,
      credentials: true
    }
  });

  ioInstance.on('connection', (socket) => {
    socket.emit('connected', { message: 'connected' });
  });

  return ioInstance;
};

const getIO = () => ioInstance;

module.exports = { initSocket, getIO };
