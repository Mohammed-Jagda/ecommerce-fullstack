const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader); // debug

    if (!authHeader) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // ✅ Case-insensitive check
    if (!authHeader.toLowerCase().startsWith('bearer')) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded); // 👈 debug

    // ✅ Fetch user correctly
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error("JWT ERROR:", error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
// Admin only — must be used after protect
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

// Consumer only — must be used after protect
const consumerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'consumer') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Consumers only.' });
  }
};

module.exports = { protect, adminOnly, consumerOnly };