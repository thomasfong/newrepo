const jwt = require('jsonwebtoken');

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

module.exports = { verifyAuth, checkLogin };