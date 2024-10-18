require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const createBid = require('./routes/bids/create'); 
const createProduct = require('./routes/products/create'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.use((req, res, next) => {
    req.io = io; // Make io accessible in routes
    next();
  });
  
  // Use the bids router
  app.use('/api/bids', createBid);
  app.use('/api/products', createProduct);
  

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
