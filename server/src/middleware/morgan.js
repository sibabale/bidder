const morgan = require('morgan');
const { logRequest } = require('../lib/logger');

morgan.token('request-id', (req) => req.id || '-');

const productionFormat =
  ':remote-addr :method :url :status :res[content-length] - :response-time ms rid=:request-id';

const devFormat = ':method :url :status :response-time ms rid=:request-id';

const logger = (req, res, next) => {
  const format = process.env.NODE_ENV === 'production' ? productionFormat : devFormat;
  return morgan(format, {
    stream: {
      write: (line) => {
        logRequest(req, line.trim());
      },
    },
  })(req, res, next);
};

module.exports = logger;
