const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
require('dotenv').config();

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

const { sequelize } = require('./models');
const passportConfig = require('./config/passport');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');
const enrollmentRoutes = require('./routes/enrollments');
const fileRoutes = require('./routes/files');
const chapterProgressRoutes = require('./routes/chapterProgress');
const pdfRoutes = require('./routes/pdf');
const testRoutes = require('./routes/tests');
const testTakingRoutes = require('./routes/test-taking');
const certificateRoutes = require('./routes/certificates');
const activityRoutes = require('./routes/activities');
const achievementRoutes = require('./routes/achievements');
const passwordResetRoutes = require('./routes/passwordReset');
const notificationRoutes = require('./routes/notifications');
const { errorHandler } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const SocketServer = require('./socket/socketServer');

const app = express();
const PORT = process.env.PORT || 5001;

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'sankalp-jwt-secret-change-in-production';
}
if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'sankalp-refresh-secret-change-in-production';
}

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400
};
app.use(cors(corsOptions));

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
const frameAncestors = [
  "'self'",
  frontendUrl,
  'http://localhost:3001',
  'https://localhost:3001',
  'http://localhost:*',
  'https://localhost:*'
].filter(Boolean);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
      connectSrc: ["'self'", "https://accounts.google.com"],
      frameAncestors
    }
  },
  frameguard: { action: 'sameorigin' }
}));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.disable('etag');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(passport.initialize());
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use('/uploads', express.static('uploads', {
  setHeaders: (res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    app: 'LMS_SANKALP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/progress', chapterProgressRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/test-taking', testTakingRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/notifications', notificationRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info('SQLite database connection established.');

    if (process.env.DB_SYNC === 'true') {
      await sequelize.sync({ alter: true });
      logger.info('Database schema synced.');
    }

    const server = app.listen(PORT, () => {
      logger.info(`LMS_SANKALP server running on port ${PORT}`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
    });

    const socketServer = new SocketServer(server);
    global.socketServer = socketServer;
    logger.info('Socket.io server initialized');
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await sequelize.close();
  process.exit(0);
});

startServer();

module.exports = app;
