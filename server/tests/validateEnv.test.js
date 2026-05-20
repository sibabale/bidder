const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { getCorsWhitelist } = require('../src/config/validateEnv');

describe('getCorsWhitelist', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('defaults to localhost in non-production when unset', () => {
    delete process.env.CORS_WHITELIST;
    process.env.NODE_ENV = 'development';
    assert.deepEqual(getCorsWhitelist(), ['http://localhost:3000']);
  });

  it('splits comma-separated origins', () => {
    process.env.CORS_WHITELIST = 'http://localhost:3000,https://app.example.com';
    assert.deepEqual(getCorsWhitelist(), [
      'http://localhost:3000',
      'https://app.example.com',
    ]);
  });

  it('throws in production when unset', () => {
    delete process.env.CORS_WHITELIST;
    process.env.NODE_ENV = 'production';
    assert.throws(() => getCorsWhitelist(), /CORS_WHITELIST must be set/);
  });
});
