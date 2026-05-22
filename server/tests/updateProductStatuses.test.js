const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { PRODUCT_STATUS } = require('../src/constants/productStatus');

describe('cron product query scope', () => {
  it('only queries non-terminal statuses', () => {
    const active = [PRODUCT_STATUS.COMING_SOON, PRODUCT_STATUS.LIVE];
    assert.ok(!active.includes(PRODUCT_STATUS.CLOSED));
    assert.ok(!active.includes(PRODUCT_STATUS.CANCELLED));
  });
});
