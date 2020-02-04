const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

const jwtKey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

const jwtCheck = (req, res, callback) => {
  // We can obtain the session token from the requests cookies, which come with every request
  const token = req.cookies.token;
  let apiResult = {};

  // if the cookie is not set, return an unauthorized error
  if (!token) {
    apiResult.meta = {
      error: "Login first",
    };
    apiResult.data = [];

    return res.status(401).json(apiResult);
  }

  let payload = 0;

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

      return res.status(401).json(apiResult);
    }
  }
  const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
  if (payload.exp - nowUnixSeconds < 30) {
    const newToken = jwt.sign({username: payload.username}, jwtKey, {
      algorithm: 'HS256',
      expiresIn: jwtExpirySeconds
    });
    res.cookie('token', newToken, {maxAge: jwtExpirySeconds});
  }
  // Set the new token as the users `token` cookie

  callback(req, res);
};

module.exports = jwtCheck;
