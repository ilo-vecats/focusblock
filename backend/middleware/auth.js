const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  console.log('Auth header:', authHeader);
  
  const token = authHeader?.split(' ')[1];
  console.log('Extracted token:', token ? 'Present' : 'Missing');
  
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    console.log('Decoded user:', decoded.user);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};