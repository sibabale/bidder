const helmet = require('helmet');

const helmetMiddleware = [
  helmet(),
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted-cdn.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
  helmet.frameguard({ action: 'deny' }),
  helmet.hsts({
    maxAge: 31536000,
    preload: true,
    includeSubDomains: false,
  }),
  helmet.referrerPolicy({ policy: 'no-referrer' }),
];

module.exports = helmetMiddleware;
