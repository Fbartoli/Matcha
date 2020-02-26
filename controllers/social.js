const usermodel = require('../models/usermodel');
const sanitize = require('sanitize-html');
const util = require('util');
const geolib = require('geolib');
// const handlers = require('../middleware/handlers');

const getUser = util.promisify(usermodel.findOneUser);
const updateFieldUser = util.promisify(usermodel.updateFieldUser);

const getHistoryViewsID = util.promisify(usermodel.getHistoryViewsId);
const addView = util.promisify(usermodel.addView);
const getView = util.promisify(usermodel.getAllViews);
const getInterest = util.promisify(usermodel.getInterest);

const getHistoryLikesID = util.promisify(usermodel.getHistoryLikesId);
const addLike = util.promisify(usermodel.addLike);
const getLike = util.promisify(usermodel.getAllLikes);

const isMatching = util.promisify(usermodel.isMatch);
const isLiked = util.promisify(usermodel.isLiked);
const addMatch = util.promisify(usermodel.addMatch);
const addUsersMatch = util.promisify(usermodel.addUsersMatch);

const getLastId = util.promisify(usermodel.lastIdInsert);
const getTopProfil = util.promisify(usermodel.getTopProfil);
// const getAllUsers = util.promisify(usermodel.getAllusers);


function response (status, message, res) {
  return res.status(status).json({client: message});
}

module.exports = {
  addView: async(req, res, payload) => {
    let user_id = payload.user_id;
    let username = sanitize(req.body.username);
    console.log(req.body);
    if (!username) {
      return response(400, 'No user provided', res);
    }
    let user_visited = await getUser('username', username).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getUser/addView', res);
      });
    console.log(user_visited);
    if (!user_visited[0]) {
      console.log('user_visited: ', user_visited);

      response(400, 'User not in the db', res);
    }
    let history = await getHistoryViewsID(user_visited[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getHistory/addView', res);
      });
    console.log(history);
    await addView(user_id, history[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error addView/addView', res);
      });
    await updateFieldUser(user_visited[0].score + 5, 'score', user_id).catch((error) => {
      console.lof(error);

      return response(500, 'Internal error update score', res);
    });

    return response(200, 'viewed', res);
  },
  getView: async(req, res, payload) => {
    let views = await getView(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete", res);
      });

    return response(200, views, res);
  },
  addLike: async(req, res, payload) => {
    let user_id = payload.user_id;
    let username = sanitize(req.body.username);
    let message = '';
    let user_liked = await getUser('username', username).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getUser/addView', res);
      });
    if (!user_liked[0]) {
      console.log('user_liked: ', user_liked);

      return response(400, 'User not in the db', res);
    }
    if (user_id === user_liked[0].id) {
      return response(400, 'Cannot self like', res);
    }
    let history = await getHistoryLikesID(user_liked[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getHistory/addLike', res);
      });
    let data = await isLiked(user_id, user_liked[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getHistory/addLike', res);
      });
    if (data.length > 0) {
      return response(400, 'User Already liked', res);
    }
    await addLike(user_id, history[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error addLike/addLike', res);
      });
    await updateFieldUser(user_liked[0].score + 10, 'score', user_id).catch((error) => {
      console.log(error);

      return response(500, 'Internal error update score', res);
    });
    let match = await isMatching(user_id, user_liked[0].id).then((data) => data.length === 2)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error isMatching', res);
      });
    if (match === true) {
      await addMatch().then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error addmatch', res);
        });
      let id = await getLastId().then((data) => data[0])
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error isMatching', res);
        });
      await addUsersMatch(user_id, user_liked[0].id, id.id).then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error isMatching', res);
        });
      // add notification real time;
      // add notification real time;
      // add notification real time;
      // add notification real time;
      message = ` and matched with ${username}`;
    }

    return response(200, `Liked${message}`, res);
  },
  getLike: async(req, res, payload) => {
    let views = await getLike(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getLike requete", res);
      });

    return response(200, views, res);
  },
  getPotentialMatch: async(req, res, payload) => {
    let user_id = payload.user_id;
    let err = '';
    let user = await getUser('id', user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    let userLocation = JSON.parse(user[0].location);
    console.log(user[0]);
    console.log(userLocation);
    let result = await getTopProfil().then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    if (err) {
      return response(500, 'Internal error', res);
    }
    let hobbies = [];
    for (let index = 0; index < result.length; index += 1) {
      hobbies[index] = await getInterest(result[index].id).then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error', res);
        });
      result[index].hobbies = [];
      for (let ind = 0; ind < hobbies[index].length; ind += 1) {
        result[index].hobbies.push(hobbies[index][ind].hobbies_name);
      }
    }

    return response(200, result, res);
  }
};
