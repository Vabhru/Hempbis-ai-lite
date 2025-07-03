// This file is the entry point for the application
// It's kept minimal since the main logic is in app.ts and server.ts

import app from './app'; // Import the default
export { app }; // Export it as a named export 'app'
export * from './config/config';

// Start the server if this file is run directly
if (require.main === module) {
  require('./server');
}
