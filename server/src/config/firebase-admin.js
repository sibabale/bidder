const admin = require('firebase-admin');

function normalizePrivateKey(key) {
  if (!key || typeof key !== 'string') return key;
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}

function parseServiceAccountJson(raw) {
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (parsed.private_key) {
    parsed.private_key = normalizePrivateKey(parsed.private_key);
  }
  return parsed;
}

function loadCredential() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return admin.credential.cert(parseServiceAccountJson(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
  }

  if (
    process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID &&
    process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL &&
    process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY
  ) {
    let privateKey = process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY;
    try {
      const wrapped = JSON.parse(privateKey);
      if (wrapped.private_key) {
        privateKey = normalizePrivateKey(wrapped.private_key);
      }
    } catch {
      privateKey = normalizePrivateKey(privateKey);
    }

    return admin.credential.cert({
      type: process.env.FIREBASE_SERVICE_ACCOUNT_TYPE || 'service_account',
      project_id: process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
      private_key_id: process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
      private_key: privateKey,
      client_email: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
      auth_uri: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
      token_uri: process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_SERVICE_ACCOUNT_UNIVERSE_DOMAIN || 'googleapis.com',
    });
  }

  throw new Error(
    'Firebase Admin: set FIREBASE_SERVICE_ACCOUNT_JSON (full service account JSON) or legacy FIREBASE_SERVICE_ACCOUNT_* env vars.'
  );
}

if (!admin.apps.length) {
  const options = { credential: loadCredential() };
  if (process.env.FIREBASE_DATABASE_URL) {
    options.databaseURL = process.env.FIREBASE_DATABASE_URL;
  }
  admin.initializeApp(options);
}

module.exports = admin;
