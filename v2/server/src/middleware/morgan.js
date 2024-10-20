const morgan = require('morgan');

const logger = (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return morgan('combined')(req, res, next);
  } else {
    return morgan('dev')(req, res, next);
  }
};

module.exports = logger;
