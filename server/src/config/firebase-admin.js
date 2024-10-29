
const admin = require('firebase-admin');

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    client_id: process.env.FIREBASE_CLIENT_ID,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bidding-app-f0697-default-rtdb.firebaseio.com/" 
});

module.exports = admin;
