import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   AI Travel Buddy Backend Server      ║
║   Running on http://localhost:${PORT}   ║
╚════════════════════════════════════════╝
  `);
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/preferences');
  console.log('  GET  /api/trips');
  console.log('  GET  /api/trips/:id');
  console.log('  POST /api/trips');
  console.log('  GET  /api/itineraries/:tripId');
  console.log('  PUT  /api/itineraries/:tripId');
  console.log('  POST /api/chat/message');
  console.log('  GET  /api/chat/history');
  console.log('  GET  /api/safety');
  console.log('  POST /api/safety/emergency');
  console.log('');
});

export default app;
