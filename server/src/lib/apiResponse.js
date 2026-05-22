function sendError(res, status, code, message, extra = {}) {
  return res.status(status).json({ code, message, ...extra });
}

function sendValidationErrors(res, errors) {
  return res.status(400).json({
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    errors: errors.array(),
  });
}

module.exports = {
  sendError,
  sendValidationErrors,
};
