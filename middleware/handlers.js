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

    return res.status(401).send('<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=/login"></head></html>');
  }

  let payload = 0;
  let apiResult = {};
  try {
    payload = jwt.verify(token, jwtKey);
    console.log(payload);
    console.log(payload.exp - Math.round(Number(new Date()) / 1000));
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      console.log(err);
      apiResult.meta = {
        error: err,
      };
      apiResult.data = [];

      return res.send(apiResult);
    }
  }
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
  if (payload.exp - nowUnixSeconds < 30) {
    apiResult.meta = {
      error: 'Token expired',
    };
    apiResult.data = [];

    return res.send(apiResult);
  }
  const newToken = jwt.sign({ username: payload.username }, jwtKey, {
    algorithm: 'HS256',
    expiresIn: jwtExpirySeconds
  });

  // Set the new token as the users `token` cookie
  res.cookie('token', newToken, { maxAge: jwtExpirySeconds });
  callback(req, res);
};

module.exports = jwtCheck;
