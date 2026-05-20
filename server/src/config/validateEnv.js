function getCorsWhitelist() {
  const raw = process.env.CORS_WHITELIST;
  if (!raw || !raw.trim()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CORS_WHITELIST must be set in production');
    }
    return ['http://localhost:3000'];
  }
  return raw.split(',').map((origin) => origin.trim()).filter(Boolean);
}

module.exports = { getCorsWhitelist };
