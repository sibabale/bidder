
const admin = require('firebase-admin');

const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bidding-app-f0697-default-rtdb.firebaseio.com/" 
});

module.exports = admin;
