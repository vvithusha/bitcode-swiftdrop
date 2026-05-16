require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const purchaseRoutes = require('./src/routes/purchaseRoutes');
const marketplaceRoutes = require('./src/routes/marketplaceRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const { notFoundHandler, errorHandler } = require('./src/middleware/errorHandler');
const { initSocket } = require('./src/socket');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api', marketplaceRoutes);
app.use('/api/profile', profileRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const port = process.env.PORT || 3001;
const server = http.createServer(app);
initSocket(server);

server.listen(port, () => {
  console.log(`SwiftDrop API listening on port ${port}`);
});
