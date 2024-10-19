require('dotenv').config();
require('./src/products/update');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const login = require('./src/routes/auth/login'); 
const logout = require('./src/routes/auth/logout'); 
const register = require('./src/routes/auth/register'); 
const createBid = require('./src/routes/bids/create'); 
const createProduct = require('./src/routes/products/create'); 
const getOneProduct = require('./src/routes/products/getOne'); 
const getAllProducts = require('./src/routes/products/getAll'); 
const setCustomClaims = require('./src/routes/auth/setCustomClaims'); 

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

  // Use the products router
  app.use('/api/products', createProduct);
  app.use('/api/products', getOneProduct);
  app.use('/api/products', getAllProducts);

  // Use the auth router
  app.use('/api/login', login);
  app.use('/api/logout', logout);
  app.use('/api/register', register);

  // Use the setClaims router
  app.use('/api/setCustomClaims', setCustomClaims);
  

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
