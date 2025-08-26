const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import the consolidated chat API handler
const chatHandler = require('./api/chat');

// Create a wrapper to handle the API routes
app.use('/api/chat', async (req, res) => {
  // Add the path from the URL path instead of query
  const urlPath = req.path.replace('/', '');
  if (urlPath) {
    req.query.path = urlPath;
  }
  
  // Call the consolidated handler
  await chatHandler(req, res);
});

// Fallback for any other API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Development server running on http://localhost:${PORT}`);
  console.log(`📡 API routes available at http://localhost:${PORT}/api/*`);
});
