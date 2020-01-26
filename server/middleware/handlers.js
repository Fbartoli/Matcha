const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

const jwtKey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

const jwtCheck = (req, res, callback) => {
  // We can obtain the session token from the requests cookies, which come with every request
  const token = req.cookies.token;

  // if the cookie is not set, return an unauthorized error
  if (!token) {
    return res.status(401).end();
  }

  let payload = 0;
  try {
  payload = jwt.verify(token, jwtKey);
  } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
       console.log(err);

       return res.status(401).redirect('/login')
    .end();
  }

  return res.status(400).redirect('/login')
  .end();
  }
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
  if (payload.exp - nowUnixSeconds > 30) {
    return res.status(400).redirect('/login')
    .end();
  }
  const newToken = jwt.sign({username: payload.username}, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  });

  // Set the new token as the users `token` cookie
  res.cookie('token', newToken, {maxAge: jwtExpirySeconds * 1000});
  callback(req, res);
};

module.exports = jwtCheck;
