const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

const jwtKey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

module.exports = {
  jwtCheck: (req, res, callback) => {
    // We can obtain the session token from the requests cookies, which come with every request
    let token = req.header('authorization');
    let apiResult = {};

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    } else {
      apiResult.meta = {
        error: "Missing token or wrong authentification type",
      };

      return res.status(401).json(apiResult);
    }
    let payload = '';
    try {
      payload = jwt.verify(token, jwtKey);
      console.log(payload);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
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
  }
};


