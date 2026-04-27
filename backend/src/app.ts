import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Import routes
import authRoutes from './auth/auth.routes';
import eventResourceRoutes from './events/eventResources.routes';
import eventRoutes from './events/events.routes';
import reportRoutes from './reports/reports.routes';
import resourceRoutes from './resources/resources.routes';
import vendorRoutes from './vendors/vendors.routes';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

const allowedOrigins = [
  ...(process.env.FRONTEND_URL?.split(',').map((origin) => origin.trim()) || []),
  'http://localhost:3000',
  'http://localhost:3002',
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients and same-origin requests.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'Event Resource Management API',
    status: 'ok',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      events: '/api/events',
      vendors: '/api/vendors',
      resources: '/api/resources',
      reports: '/api/reports',
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/events/:eventId/resources', eventResourceRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/reports', reportRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
