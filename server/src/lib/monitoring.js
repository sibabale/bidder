const { logError } = require('./logger');

let sentry = null;

function initMonitoring() {
  if (!process.env.SENTRY_DSN) {
    return;
  }

  try {
    // Optional: only loaded when SENTRY_DSN is configured
    sentry = require('@sentry/node');
    sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        message: 'Sentry init failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    );
  }
}

function captureError(error, context = {}) {
  if (sentry) {
    sentry.captureException(error, { extra: context });
    return;
  }
  logError(null, 'Unhandled system error', error, context);
}

module.exports = {
  initMonitoring,
  captureError,
};
