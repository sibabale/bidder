function log(level, message, meta = {}) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };
  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else {
    console.log(line);
  }
}

function logRequest(req, message, meta = {}) {
  log('info', message, {
    requestId: req.id,
    method: req.method,
    path: req.path,
    ...meta,
  });
}

function logError(req, message, error, meta = {}) {
  log('error', message, {
    requestId: req?.id,
    method: req?.method,
    path: req?.path,
    error: error?.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error?.stack,
    ...meta,
  });
}

module.exports = {
  log,
  logRequest,
  logError,
};
