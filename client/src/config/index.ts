import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    appId: '1:476462137958:web:b6af2f09205691d03be3a7',
    apiKey: 'AIzaSyDKkL6Y47yE6nrUk7D69MJHjXQY8DFem_o',
    projectId: 'bidding-app-f0697',
    authDomain: 'bidding-app-f0697.firebaseapp.com',
    measurementId: 'G-3NXMK2MXYF',
    storageBucket: 'bidding-app-f0697.appspot.com',
    messagingSenderId: '476462137958',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
