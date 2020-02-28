const usermodel = require('../models/usermodel');
const sanitize = require('sanitize-html');
const util = require('util');
const handlers = require('../middleware/handlers');
// const handlers = require('../middleware/handlers');

const getUser = util.promisify(usermodel.findOneUser);
const getFullProfile = util.promisify(usermodel.getFullProfile);
const updateFieldUser = util.promisify(usermodel.updateFieldUser);

const getHistoryViewsID = util.promisify(usermodel.getHistoryViewsId);
const addView = util.promisify(usermodel.addView);
const getView = util.promisify(usermodel.getAllViews);

const getHistoryLikesID = util.promisify(usermodel.getHistoryLikesId);
const addLike = util.promisify(usermodel.addLike);
const getLike = util.promisify(usermodel.getAllLikes);

const isMatching = util.promisify(usermodel.isMatch);
const isLiked = util.promisify(usermodel.isLiked);
const addMatch = util.promisify(usermodel.addMatch);
const addUsersMatch = util.promisify(usermodel.addUsersMatch);

const getLastId = util.promisify(usermodel.lastIdInsert);
const getTopProfil = util.promisify(usermodel.getTopProfil);

const algo = util.promisify(handlers.algo);
// const getAllUsers = util.promisify(usermodel.getAllusers);


function response (status, message, res) {
  return res.status(status).json({client: message});
}

module.exports = {
  addView: async(req, res, payload) => {
    let user_id = payload.user_id;
    console.log(user_id);
    let username = sanitize(req.body.username);
    if (!username) {
      return response(400, 'No user provided', res);
    }
    let user_visited = await getUser('users.username', username).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getUser/addView', res);
      });
    console.log(user_visited);
    if (!user_visited[0]) {
      console.log('user_visited: ', user_visited);

      return response(400, 'User not in the db', res);
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
    let user_liked = await getUser('users.username', username).then((data) => data)
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
  // scoring weight based on differences
  // sexual orientation 0 if exact 100 if not matching
  // distance 0.1 per meters
  // interest 10 per unmatched interest
  // score difference 0.01 per pts
  getPotentialMatch: async(req, res, payload) => {
    let user_id = payload.user_id;
    let number = req.query.number;
    console.log(user_id);
    let user = await getFullProfile(user_id).then((data) => data[0])
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    if (!user) {
      return response(500, 'User not found', res);
    }
    let users = await getTopProfil(user_id, user).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    if (!users[0]) {
      return response(200, 'no potential mate, natural selection bitch', res);
    }
    users.unshift(user);
    for (let index = 0; index < users.length; index += 1) {
      await algo(users[index], user).then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error', res);
        });
    }
    users.shift();
    let result = users.sort(function compare(a, b) {
      if (a.matchScore < b.matchScore) {
        return -1;
      }
      if (a.matchScore > b.matchScore) {
        return 1;
      }

      return 0;
    });
    if (number > result.length) {
      number = result.length;
    }

    return response(200, {length: number,
      data: result.slice(0, number)}, res);
  }
};
