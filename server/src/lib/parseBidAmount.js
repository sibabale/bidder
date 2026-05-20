function parseBidAmount(raw) {
  const amount = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }
  return amount;
}

module.exports = { parseBidAmount };
