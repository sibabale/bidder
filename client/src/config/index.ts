import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:476462137958:web:b6af2f09205691d03be3a7',
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyDKkL6Y47yE6nrUk7D69MJHjXQY8DFem_o',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'bidding-app-f0697',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'bidding-app-f0697.firebaseapp.com',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-3NXMK2MXYF',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'bidding-app-f0697.appspot.com',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '476462137958',
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
