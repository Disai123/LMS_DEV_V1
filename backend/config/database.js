require('dotenv').config();
const path = require('path');

function trimEnv(value) {
  if (value === undefined || value === null) return value;
  return String(value).trim().replace(/^["']|["']$/g, '');
}

function getSqliteStorage() {
  const storage = trimEnv(process.env.DB_STORAGE) || './database.sqlite';
  return path.isAbsolute(storage) ? storage : path.resolve(process.cwd(), storage);
}

function isRemoteDatabase(host) {
  return host &&
         host !== 'localhost' &&
         host !== '127.0.0.1' &&
         !host.startsWith('192.168.') &&
         !host.startsWith('10.');
}

function getSSLConfig(host) {
  if (isRemoteDatabase(host)) {
    return {
      require: true,
      rejectUnauthorized: false
    };
  }
  return false;
}

function isSqliteDialect() {
  return trimEnv(process.env.DB_DIALECT) === 'sqlite';
}

function buildPostgresConfig(env, overrides = {}) {
  const host = trimEnv(process.env.DB_HOST) || 'localhost';
  return {
    username: trimEnv(process.env.DB_USER) || 'postgres',
    password: trimEnv(process.env.DB_PASSWORD) || 'password',
    database: trimEnv(process.env.DB_DATABASE || process.env.DB_NAME) || 'lms_db',
    host,
    port: trimEnv(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: env === 'development' ? console.log : false,
    pool: {
      max: env === 'production' ? 20 : 5,
      min: env === 'production' ? 5 : 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: env === 'production'
        ? { require: true, rejectUnauthorized: false }
        : getSSLConfig(host)
    },
    ...overrides
  };
}

function buildSqliteConfig(env) {
  return {
    dialect: 'sqlite',
    storage: getSqliteStorage(),
    logging: env === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {}
  };
}

function buildConfig(env) {
  if (isSqliteDialect()) {
    return buildSqliteConfig(env);
  }
  if (env === 'test') {
    const base = buildPostgresConfig(env);
    return {
      ...base,
      database: `${base.database}_test`,
      logging: false
    };
  }
  return buildPostgresConfig(env);
}

module.exports = {
  development: buildConfig('development'),
  test: buildConfig('test'),
  production: buildConfig('production'),
  isSqliteDialect,
  getSqliteStorage,
  getSSLConfig,
  trimEnv
};
