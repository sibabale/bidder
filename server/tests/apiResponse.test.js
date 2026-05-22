const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { sendError } = require('../src/lib/apiResponse');

describe('sendError', () => {
  it('returns code and message in JSON body', () => {
    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };

    sendError(res, 400, 'TEST_CODE', 'Something went wrong');

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { code: 'TEST_CODE', message: 'Something went wrong' });
  });
});
