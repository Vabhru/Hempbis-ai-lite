const http = require('http');

const options = {
  host: 'localhost', // or '127.0.0.1'
  port: process.env.PORT || 3001, // Use the same port as your application
  path: '/api/health', // The health check endpoint
  timeout: 2000, // 2 seconds timeout
};

const request = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  if (res.statusCode === 200) {
    process.exit(0); // Healthy
  } else {
    process.exit(1); // Unhealthy
  }
});

request.on('error', (err) => {
  console.error('ERROR', err);
  process.exit(1); // Unhealthy on error
});

request.end();
