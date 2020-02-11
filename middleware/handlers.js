const jwt = require('jsonwebtoken');
const CONFIG = require('../config/config');

const jwtKey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

module.exports = {
  jwtCheck: (req, res, callback) => {
    // We can obtain the session token from the requests cookies, which come with every request
    let token = req.header('authorization');

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    } else {

      return res.status(401).json({
        client: "Missing token or wrong authentification type",
      });
    }
    let payload = '';
    try {
      payload = jwt.verify(token, jwtKey);
      console.log(payload);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        console.log(err);

        return res.status(401).json({client: 'Token error'});
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
  },
  jwtRefresh: (req, res) => {
    // We can obtain the session token from the requests cookies, which come with every request
    let token = req.header('authorization');

    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    } else {

      return res.status(401).json({
        client: "Missing token or wrong authentification type",
      });
    }
    let payload = '';
    try {
      payload = jwt.verify(token, jwtKey);
      console.log(payload);
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        console.log(err);

        return res.status(401).json({client: 'Token error'});
      }
    }
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    if (payload.exp - nowUnixSeconds < 30) {
      const newToken = jwt.sign({username: payload.username}, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
      });

      return res.status(200).json({token: newToken});
    }
    // Set the new token as the users `token` cookie

    return res.status(401).json({client: 'still usable'});
  },
  isValidDate: (dateString, callback) => {
    let regEx = /^\d{4}-\d{2}-\d{2}$/;
    let error;
    // Invalid format
    if (!dateString.match(regEx)) {
      let error = 'Wrong format';

      return callback(error, null);
    }
    let date = new Date(dateString);
    let dNum = date.getTime();
    // NaN value, Invalid date
    if (!dNum && dNum !== 0) {
      let error = 'Wrong format';

      return callback(error, null);
    }


    return callback(error, date.toISOString().slice(0, 10) === dateString);
  }
};


