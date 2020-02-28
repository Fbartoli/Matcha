const jwt = require('jsonwebtoken');
const usermodel = require('../models/usermodel');
const CONFIG = require('../config/config');
const path = require("path");
const multer = require("multer");
const geolib = require('geolib');
const util = require('util');
const jwtKey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;
const rootDir = path.dirname(require.main.filename || process.mainModule.filename);
const uniqid = require('uniqid');
const {add, multiply, subtract} = require('async-math');


async function computeMatchScore(result, user, callback) {
  try {
    if (user.interested_in !== 3) {
      let distanceScore = await multiply(result.distance, 0.5).then((data) => data);
      let diffScore = await subtract(user.score, result.score).then((data) => data);
      diffScore = Math.abs(diffScore);
      diffScore = await multiply(diffScore, 0.01).then((data) => data);
      let genderScore = await subtract(user.interested_in, result.gender_id).then((data) => data);
      genderScore = Math.abs(genderScore);
      genderScore = await multiply(genderScore, 100).then((data) => data);
      result.matchScore = await add(result.matchScore, diffScore).then((data) => data);
      result.matchScore = await add(result.matchScore, genderScore).then((data) => data);
      result.matchScore = await add(result.matchScore, distanceScore).then((data) => data);
    } else {
      let distanceScore = await multiply(result.distance, 0.5).then((data) => data);
      let diffScore = await subtract(user.score, result.score).then((data) => data);
      diffScore = Math.abs(diffScore);
      diffScore = await multiply(diffScore, 0.01).then((data) => data);
      result.matchScore = await add(result.matchScore, diffScore).then((data) => data);
      result.matchScore = await add(result.matchScore, distanceScore).then((data) => data);
    }
  } catch (error) {
    console.log(error);

    return callback(error, null);
  }

  return callback(null, 'ok');
}
function distance(result, user, callback) {
  try {
    result.distance = geolib.getDistance({latitude: user.location.lat,
      longitude: user.location.lng}, {latitude: result.location.lat,
      longitude: result.location.lng}) / 1000;
  } catch (error) {
    console.log(error);

    return callback(error, null);
  }

  return callback(null, 'ok');
}

const getInterest = util.promisify(usermodel.getInterest);
const getScore = util.promisify(computeMatchScore);
const getDistancePro = util.promisify(distance);
module.exports = {
  jwtCheck: (req, res, callback) => {
    if (!req.headers) {
      return res.status(401).json({
        client: "Missing headers",
      });
    }
    let token = req.header('Authorization');

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
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        console.log(err);

        return res.status(401).json({client: 'Token error'});
      }
    }
    // const user_id = payload.user_id;
    // const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    // if (payload.exp - nowUnixSeconds < 30) {
    //   const newToken = jwt.sign({user_id}, jwtKey, {
    //     algorithm: 'HS256',
    //     expiresIn: jwtExpirySeconds
    //   });
    // }
    // Set the new token as the users `token` cookie
    callback(req, res, payload);
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

    return callback(null, date.toISOString().slice(0, 10) === dateString);
  },
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, path.join(`${rootDir}/uploads/uploads`));
    },
    filename: (req, file, callback) => {
      const match = ["image/png", "image/jpeg"];
      if (match.indexOf(file.mimetype) === -1) {
        let message = `${file.originalname} is invalid. Only accept png/jpeg.`;

        return callback(message, null);
      }

      let filename = `${uniqid()}-matcha${path.extname(file.originalname)}`;
      callback(null, filename);
    }
  }),
  calculateAge: (birthday, callback) => {
    console.log(birthday);
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs);
    let age = Math.abs(ageDate.getUTCFullYear() - 1970);

    return callback(null, age);
  },
  algo: async (result, user, callback) => {
    let hobbies = [];
    result.matchScore = 0;
    result.hobbies = [];
    hobbies = await getInterest(result.id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return callback(error, null);
      });
    Reflect.deleteProperty(result, 'id');
    for (let ind = 0; ind < hobbies.length; ind += 1) {
      result.hobbies.push(hobbies[ind].hobbies_name);
      if (!user.hobbies.includes(hobbies[ind].hobbies_name)) {
        result.matchScore = await add(result.matchScore, 10).then((data) => data);
      }
    }
    if (!result.location) {
      return callback(`Error on: algo ${result.username}`, null);
    }
    if (typeof result.location === 'string') {
      result.location = JSON.parse(result.location);
    }
    if (!result.location) {
      return callback(`Error on: algo ${result.username}`, null);
    }
    await getDistancePro(result, user).then((data) => data)
      .catch((error) => {
        console.log(error);

        return callback(error, null);
      });
    await getScore(result, user).then((data) => data)
      .catch((error) => {
        console.log(error);

        return callback(error, null);
      });

    return callback(null, 'ok');
  }
};

