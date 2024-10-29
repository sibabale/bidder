const cors = require('cors');


console.log(process.env.CORS_WHITELIST);
console.log(process.env.CORS_WHITELIST.split(','));


const corsOptions = {
  origin: process.env.CORS_WHITELIST.split(','),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
