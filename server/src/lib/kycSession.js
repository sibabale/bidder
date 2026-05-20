const redisClient = require('../config/redis-client');

const KYC_SESSION_TTL_SECONDS = 30 * 60;
const kycSessionKey = (clientId) => `kyc:session:${clientId}`;

async function storeKycSession(clientId, payload) {
  await redisClient.setex(
    kycSessionKey(clientId),
    KYC_SESSION_TTL_SECONDS,
    JSON.stringify(payload)
  );
}

async function getKycSession(clientId) {
  const raw = await redisClient.get(kycSessionKey(clientId));
  if (!raw) {
    return null;
  }
  return JSON.parse(raw);
}

async function consumeKycSession(clientId) {
  const session = await getKycSession(clientId);
  if (!session) {
    return null;
  }
  await redisClient.del(kycSessionKey(clientId));
  return session;
}

module.exports = {
  KYC_SESSION_TTL_SECONDS,
  storeKycSession,
  getKycSession,
  consumeKycSession,
};
