/**
 * Entry point for the application.
 *
 * Load order is intentional:
 *  1. dotenv — must run before any module reads process.env
 *  2. env.ts — validates all required variables (exits on failure)
 *  3. database — connects to MongoDB (exits on failure)
 *  4. createApp — builds the Express application
 *  5. http.listen — starts accepting requests
 */
import 'dotenv/config';

import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { createApp } from './app';

const startServer = async (): Promise<void> => {
  // Connect to MongoDB before accepting any HTTP traffic
  await connectDatabase();

  const app = createApp();
  const port = parseInt(env.PORT, 10);

  const server = app.listen(port, () => {
    console.info(`Server running in ${env.NODE_ENV} mode on port ${port}`);
    console.info(`Root: http://localhost:${port}/`);
  });

  // Graceful shutdown
  const shutdown = (signal: string): void => {
    console.info(`\n${signal} received — shutting down gracefully…`);

    server.close(() => {
      void disconnectDatabase().then(() => {
        console.info('HTTP server closed. Goodbye.');
        process.exit(0);
      });
    });

    // Force-exit if the server hasn't closed within 10 s
    setTimeout(() => {
      console.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  // Catch unhandled promise rejections — log and exit
  process.on('unhandledRejection', (reason: unknown) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
  });
};

void startServer();
