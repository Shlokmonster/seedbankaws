import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import os from 'os';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import storageCenterRoutes from './routes/storageCenterRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import monitoringRoutes from './routes/monitoringRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import logger from './utils/logger.js';
import pool from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Compression
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Enable CORS
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Static upload folder mapping
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger API documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SeedBank Genetic Resource Cloud API',
      version: '1.0.0',
      description: 'API documentation for SeedBank platform',
    },
    servers: [
      {
        url: process.env.FRONTEND_URL || 'http://localhost:5001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health, Liveness, Readiness endpoints
app.get('/health', async (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      timestamp: new Date(),
      uptime: process.uptime(),
      service: 'seedbank-api'
    });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: error.message });
  }
});

app.get('/api/ready', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ ready: true });
  } catch (error) {
    res.status(503).json({ ready: false, error: error.message });
  }
});

app.get('/api/metrics', async (req, res) => {
  try {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const loadAvg = os.loadavg();
    
    res.json({
      cpu: {
        usage: loadAvg[0] * 100 / os.cpus().length,
        cores: os.cpus().length,
        loadAverage: loadAvg
      },
      memory: {
        total: totalMem / 1024 / 1024,
        free: freeMem / 1024 / 1024,
        used: (totalMem - freeMem) / 1024 / 1024,
        usagePercent: ((totalMem - freeMem) / totalMem) * 100
      },
      uptime: process.uptime(),
      platform: os.platform(),
      nodeVersion: process.version
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/seeds', seedRoutes);
app.use('/api/storage-centers', storageCenterRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
