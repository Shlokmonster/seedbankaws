import app from './app.js';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Test DB Connection before starting server
const startServer = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connected successfully!');
    client.release();

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });

    // Graceful Shutdown Handler
    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        try {
          await pool.end();
          console.log('PostgreSQL pool closed.');
          process.exit(0);
        } catch (err) {
          console.error('Error during pool shutdown:', err);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('Database connection failed. Server not started.', error);
    process.exit(1);
  }
};

startServer();
