const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {

    // console.log("token", req)
    
  const token = req.cookies.token;

  

  if (!token) {
    return res.status(401).json({ error: 'Access Denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
