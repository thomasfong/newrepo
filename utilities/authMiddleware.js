const jwt = require('jsonwebtoken');
const utilities = require('../utilities/');

// Middleware to verify JWT token
function verifyAuth(req, res, next) {
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).redirect('/account/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('jwt');
    return res.status(401).redirect('/account/login');
  }
}

// Middleware to check if user is already logged in
function checkLogin(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    try {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return res.redirect('/account/');
    } catch (error) {
      next();
    }
  } else {
    next();
  }
}

// Middleware to require Employee or Admin role
function requireEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt;
  
  if (!token) {
    req.flash('notice', 'Please log in to access this page.');
    return res.status(401).redirect('/account/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (decoded.account_type !== 'Employee' && decoded.account_type !== 'Admin') {
      req.flash('notice', 'You do not have sufficient privileges to access this page.');
      return res.status(403).redirect('/account/login');
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie('jwt');
    req.flash('notice', 'Session expired. Please log in again.');
    return res.status(401).redirect('/account/login');
  }
}

module.exports = { 
  verifyAuth, 
  checkLogin,
  requireEmployeeOrAdmin 
};