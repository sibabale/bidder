import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { publicEnv } from '../lib/env';

const firebaseConfig = {
    appId: publicEnv.firebase.appId,
    apiKey: publicEnv.firebase.apiKey,
    projectId: publicEnv.firebase.projectId,
    authDomain: publicEnv.firebase.authDomain,
    measurementId: publicEnv.firebase.measurementId,
    storageBucket: publicEnv.firebase.storageBucket,
    messagingSenderId: publicEnv.firebase.messagingSenderId,
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
