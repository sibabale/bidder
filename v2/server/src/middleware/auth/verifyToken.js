const admin = require('../../config/firebase-admin');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'Authorization token is missing' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Current time in seconds
    const currentTime = Math.floor(Date.now() / 1000); 

    // Check if the token is expired
    if (decodedToken.exp < currentTime) {
      // Log the user out by revoking refresh tokens
      await admin.auth().revokeRefreshTokens(decodedToken.uid);

      return res.status(401).json({ message: 'Token has expired. User has been logged out.' });
    }

    req.userId = decodedToken.uid; // Attach user ID to request
    next(); // Proceed to next middleware/handler
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Token has expired. User has been logged out.' });
  }
};

module.exports = verifyToken;
