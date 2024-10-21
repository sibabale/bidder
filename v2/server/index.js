require('dotenv').config();
require('./src/crons/products/update');

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const morgan = require('./src/middleware/morgan');
const corsMiddleware = require('./src/middleware/cors');
const helmetMiddleware = require('./src/middleware/helmet');

const login = require('./src/routes/auth/login');
const logout = require('./src/routes/auth/logout');
const register = require('./src/routes/auth/register');
const createBid = require('./src/routes/bids/create');
const createProduct = require('./src/routes/products/create');
const getOneProduct = require('./src/routes/products/getOne');
const getAllProducts = require('./src/routes/products/getAll');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_WHITELIST.split(','), 
    methods: ['GET', 'POST'], 
    credentials: true, 
  }
});

app.use(express.json());
app.use(morgan); 
app.use(corsMiddleware); 
app.use(helmetMiddleware); 

app.use((req, res, next) => {
    req.io = io;
    next();
});

// default route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// Use routers
app.use('/api/bids', createBid);

app.use('/api/products', createProduct);
app.use('/api/products', getOneProduct);
app.use('/api/products', getAllProducts);

app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/register', register);


// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

exports.default = app;
