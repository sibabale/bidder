const {initializeApp} = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

require('firebase/firestore');

const firebaseConfig = {
    appId: '1:476462137958:web:b6af2f09205691d03be3a7',
    apiKey: 'AIzaSyDKkL6Y47yE6nrUk7D69MJHjXQY8DFem_o',
    projectId: 'bidding-app-f0697',
    authDomain: 'bidding-app-f0697.firebaseapp.com',
    measurementId: 'G-3NXMK2MXYF',
    storageBucket: 'bidding-app-f0697.appspot.com',
    messagingSenderId: '476462137958',
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

module.exports = db;
