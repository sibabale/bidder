require('dotenv').config();

const { initMonitoring, captureError } = require('./src/lib/monitoring');
initMonitoring();

require('./src/config/firebase-admin');
require('./src/crons/products/updateStatus');

const express = require('express');
const http = require('http');

const requestIdMiddleware = require('./src/middleware/requestId');
const morgan = require('./src/middleware/morgan');
const corsMiddleware = require('./src/middleware/cors');
const helmetMiddleware = require('./src/middleware/helmet');
const { sendError } = require('./src/lib/apiResponse');
const { logError } = require('./src/lib/logger');

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
const complycubeWebhook = require('./src/routes/kyc/verifyEvent');
const cronProductStatus = require('./src/routes/internal/cronProductStatus');
const health = require('./src/routes/health');
const uploadImage = require('./src/routes/upload/image');

const app = express();
const server = http.createServer(app);

app.use(requestIdMiddleware);
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (buf?.length) {
        req.rawBody = buf;
      }
    },
  })
);
app.use(morgan);
app.use(corsMiddleware);
app.use(helmetMiddleware);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.use('/health', health);

app.use('/api/bids', createBid);
app.use('/api/products', createProduct);
app.use('/api/products', getOneProduct);
app.use('/api/products', getAllProducts);
app.use('/api/upload', uploadImage);

app.use('/api/login', login);
app.use('/api/logout', logout);
app.use('/api/register', register);
app.use('/api/register/verify', verify);

app.use('/api/get-token', getToken);
app.use('/api/identity-check', identityCheck);
app.use('/api/generate-kyc-token', generateKYCToken);
app.use('/api/kyc/webhook', complycubeWebhook);

app.use('/api/internal/cron', cronProductStatus);

app.use((err, req, res, next) => {
  logError(req, 'Unhandled error', err);
  captureError(err, { requestId: req.id, path: req.path });
  if (res.headersSent) {
    next(err);
    return;
  }
  sendError(res, 500, 'INTERNAL_ERROR', 'Internal server error');
});

process.on('unhandledRejection', (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logError(null, 'Unhandled rejection', error);
  captureError(error, { source: 'unhandledRejection' });
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(
      JSON.stringify({
        level: 'info',
        message: 'Server started',
        port: PORT,
        timestamp: new Date().toISOString(),
      })
    );
  });
}

module.exports = app;
