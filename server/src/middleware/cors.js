const cors = require('cors');
const { getCorsWhitelist } = require('../config/validateEnv');

const corsOptions = {
  origin: getCorsWhitelist(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
