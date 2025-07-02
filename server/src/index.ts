// This file is the entry point for the application
// It's kept minimal since the main logic is in app.ts and server.ts

export { app } from './app';
export * from './config/config';

// Start the server if this file is run directly
if (require.main === module) {
  require('./server');
}
