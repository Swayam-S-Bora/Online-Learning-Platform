const jwt = require('jsonwebtoken');
const redis = require('../redisClient');

const JWT_SECRET = process.env.JWT_SECRET;


async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    // Check Redis session
    const sessionToken = await redis.get(`sess:${payload.userId}`);
    if (sessionToken !== token) {
      return res.status(401).json({ msg: 'Session expired or invalid' });
    }

    req.user = { id: payload.userId };
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = authMiddleware;
