const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { parseBidAmount } = require('../src/lib/parseBidAmount');

describe('parseBidAmount', () => {
  it('accepts positive numbers', () => {
    assert.equal(parseBidAmount(100), 100);
  });

  it('coerces numeric strings', () => {
    assert.equal(parseBidAmount('250.5'), 250.5);
  });

  it('rejects zero, negative, and invalid values', () => {
    assert.equal(parseBidAmount(0), null);
    assert.equal(parseBidAmount(-1), null);
    assert.equal(parseBidAmount('abc'), null);
    assert.equal(parseBidAmount(null), null);
  });
});
