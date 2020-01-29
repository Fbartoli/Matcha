const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

const jwtKey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

const jwtCheck = (req, res, callback) => {
  // We can obtain the session token from the requests cookies, which come with every request
  const token = req.cookies.token;

  // if the cookie is not set, return an unauthorized error
  if (!token) {
    res.set('Content-Type', 'text/html');
    res.status(401).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/login"></head></html>');
  }

  let payload = 0;
  try {
  payload = jwt.verify(token, jwtKey);
  } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        // console.log(err);
        res.set('Content-Type', 'text/html');
        res.status(401).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/login"></head></html>');
  }

  return res.redirect(400, '/login')
  .end();
  }
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
  if (payload.exp - nowUnixSeconds > 30) {
    res.set('Content-Type', 'text/html');
    res.status(400).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/login"></head></html>');
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
