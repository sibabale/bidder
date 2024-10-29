
const admin = require('firebase-admin');

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    auth_uri: process.env.FIREBASE_TYPE,
    client_id: process.env.FIREBASE_TYPE,
    token_uri: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_TYPE,
    private_key: process.env.FIREBASE_TYPE,
    client_email: process.env.FIREBASE_TYPE,
    private_key_id: process.env.FIREBASE_TYPE,
    universe_domain: process.env.FIREBASE_TYPE,
    client_x509_cert_url: process.env.FIREBASE_TYPE,
    auth_provider_x509_cert_url: process.env.FIREBASE_TYPE,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bidding-app-f0697-default-rtdb.firebaseio.com/" 
});

module.exports = admin;
