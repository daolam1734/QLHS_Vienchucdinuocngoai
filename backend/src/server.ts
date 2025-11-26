import app from './app';
import config from './config';
import pool from './config/database';

const PORT = config.port;

// Test database connection
const testDatabaseConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('📊 Database connection test:', result.rows[0]);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    const dbConnected = await testDatabaseConnection();
    
    if (!dbConnected && config.env === 'production') {
      console.error('Cannot start server without database connection in production');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log('\n🚀 Server is running!');
      console.log(`📍 Environment: ${config.env}`);
      console.log(`📍 Port: ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}${config.apiPrefix}`);
      console.log(`📍 Health: http://localhost:${PORT}/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\nSIGINT received. Shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

startServer();
