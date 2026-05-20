require('dotenv').config();

require('./src/config/firebase-admin');
require('./src/crons/products/updateStatus');

const express = require('express');
const http = require('http');
const Ably = require('ably');

const ably = new Ably.Realtime(process.env.ABLY_API_KEY);

const morgan = require('./src/middleware/morgan');
const corsMiddleware = require('./src/middleware/cors');
const helmetMiddleware = require('./src/middleware/helmet');

const login = require('./src/routes/auth/login');
const verify = require('./src/routes/auth/verify');
const logout = require('./src/routes/auth/logout');
const register = require('./src/routes/auth/register');
const getToken = require('./src/routes/auth/getToken');
const createBid = require('./src/routes/bids/create');
const createProduct = require('./src/routes/products/create');
const identityCheck = require('./src/routes/kyc/identityCheck');
const getOneProduct = require('./src/routes/products/getOne');
const getAllProducts = require('./src/routes/products/getAll');
const generateKYCToken = require('./src/routes/kyc/generateToken');
const cronProductStatus = require('./src/routes/internal/cronProductStatus');

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(morgan);
app.use(corsMiddleware);
app.use(helmetMiddleware);

app.use((req, res, next) => {
  req.ably = ably;
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/api/bids', createBid);
app.use('/api/products', createProduct);
app.use('/api/products', getOneProduct);
app.use('/api/products', getAllProducts);

app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/register', register);
app.use('/api/register/verify', verify);

app.use('/api/get-token', getToken);
app.use('/api/identity-check', identityCheck);
app.use('/api/generate-kyc-token', generateKYCToken);

app.use('/api/internal/cron', cronProductStatus);

ably.connection.on('connected', () => {
  console.log('Ably connected successfully');
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
