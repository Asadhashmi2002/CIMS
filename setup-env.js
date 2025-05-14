const fs = require('fs');
const path = require('path');

// Create client .env file
const clientEnvPath = path.join(__dirname, 'client', '.env');
const clientEnvContent = `REACT_APP_API_URL=/api`;

// Create server .env file
const serverEnvPath = path.join(__dirname, 'server', '.env');
const serverEnvContent = `NODE_ENV=production
PORT=5000
JWT_SECRET=coaching-institute-secret-key`;

// Write files
try {
  fs.writeFileSync(clientEnvPath, clientEnvContent);
  console.log('Created client .env file at', clientEnvPath);
  
  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('Created server .env file at', serverEnvPath);
  
  console.log('Environment setup complete!');
} catch (error) {
  console.error('Error creating .env files:', error);
  process.exit(1);
} 