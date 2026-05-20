const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  PRODUCT_STATUS,
  BLOCKED_BID_STATUSES,
} = require('../src/constants/productStatus');

describe('product status constants', () => {
  it('blocks bids before live', () => {
    assert.ok(BLOCKED_BID_STATUSES.includes(PRODUCT_STATUS.COMING_SOON));
    assert.ok(BLOCKED_BID_STATUSES.includes(PRODUCT_STATUS.CLOSED));
  });

  it('uses snake_case coming_soon', () => {
    assert.equal(PRODUCT_STATUS.COMING_SOON, 'coming_soon');
  });
});
