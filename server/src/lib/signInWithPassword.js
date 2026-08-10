/**
 * Email/password sign-in via Identity Toolkit REST (server-side).
 * Requires FIREBASE_WEB_API_KEY (same Web API key as the Firebase client app).
 */
async function signInWithPassword(email, password) {
  const apiKey = process.env.FIREBASE_WEB_API_KEY || process.env.FIREBASE_API_KEY;
  if (!apiKey) {
    const err = new Error('FIREBASE_WEB_API_KEY is not configured');
    err.code = 'config';
    throw err;
  }

  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    const message = data.error?.message || 'Login failed';
    const err = new Error(message);
    err.code = mapIdentityToolkitError(message);
    err.raw = data.error;
    throw err;
  }

  return {
    localId: data.localId,
    email: data.email,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
  };
}

function mapIdentityToolkitError(message) {
  switch (message) {
    case 'EMAIL_NOT_FOUND':
      return 'auth/user-not-found';
    case 'INVALID_PASSWORD':
      return 'auth/wrong-password';
    case 'INVALID_LOGIN_CREDENTIALS':
    case 'INVALID_EMAIL':
      return 'auth/invalid-credential';
    case 'USER_DISABLED':
      return 'auth/user-disabled';
    default:
      return 'auth/unknown';
  }
}

module.exports = { signInWithPassword };
