import { Pool } from 'pg';
import config from './index';

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  max: 30, // Tăng số connection tối đa
  min: 5, // Giữ sẵn 5 connection
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Tăng timeout
  statement_timeout: 30000, // Timeout cho query
  query_timeout: 30000,
});

// Set UTF-8 encoding for all connections
pool.on('connect', async (client) => {
  await client.query("SET client_encoding TO 'UTF8'");
  await client.query("SET timezone TO 'Asia/Ho_Chi_Minh'");
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  // Không tắt server, chỉ log lỗi
});

// Log pool statistics periodically in development
if (config.env === 'development') {
  setInterval(() => {
    console.log('📊 Pool Stats:', {
      total: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount
    });
  }, 60000); // Mỗi 60s
}

export default pool;
