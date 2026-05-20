function requiredPublicEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy client/.env.example to .env.local.`
    );
  }
  return value;
}

export const publicEnv = {
  apiUrl: requiredPublicEnv('NEXT_PUBLIC_API_URL'),
  firebase: {
    apiKey: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
};
