require('dotenv').config();

module.exports = {
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

