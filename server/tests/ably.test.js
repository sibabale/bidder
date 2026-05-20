const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { BID_EVENT_NAME, getAuctionChannelName } = require('../src/lib/ably');

describe('ably helpers', () => {
  it('builds per-auction channel names', () => {
    assert.equal(getAuctionChannelName('product-123'), 'auction-product-123');
  });

  it('uses a single bid event name', () => {
    assert.equal(BID_EVENT_NAME, 'new_bid');
  });
});
