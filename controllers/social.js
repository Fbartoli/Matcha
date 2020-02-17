// include the model (aka DB connection)
const usermodel = require('../models/usermodel');
const sanitize = require('sanitize-html');
const util = require('util');
// const handlers = require('../middleware/handlers');

const getUser = util.promisify(usermodel.findOneUser);
const updateFieldUser = util.promisify(usermodel.updateFieldUser);

const getHistoryViewsID = util.promisify(usermodel.getHistoryViewsId);
const addView = util.promisify(usermodel.addView);
const getView = util.promisify(usermodel.getAllViews);

const getHistoryLikesID = util.promisify(usermodel.getHistoryLikesId);
const addLike = util.promisify(usermodel.addLike);
const getLike = util.promisify(usermodel.getAllLikes);
// const getAllUsers = util.promisify(usermodel.getAllusers);


function response (status, message, res) {
  return res.status(status).json({client: message});
}

module.exports = {
  addView: async(req, res, payload) => {
    let user_id = payload.user_id;
    let username = sanitize(req.body.username);
    let user_visited = await getUser('username', username).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getUser/addView');
      });
    console.log(user_visited);
    if (!user_visited) {
      console.log('user_visited: ', user_visited);

      response(400, 'User not in the db', res);
    }
    let history = await getHistoryViewsID(user_visited[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getHistory/addView');
      });
    console.log(history);
    await addView(user_id, history[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error addView/addView');
      });
    await updateFieldUser(user_visited[0].score + 5, 'score', user_id).catch((error) => {
      console.lof(error);

      return response(500, 'Internal error update score');
    });

    return response(200, 'viewed', res);
  },
  getView: async(req, res, payload) => {
    let views = await getView(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete");
      });

    return response(200, views, res);
  },
  addLike: async(req, res, payload) => {
    let user_id = payload.user_id;
    let username = sanitize(req.body.username);
    let user_liked = await getUser('username', username).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getUser/addView');
      });
    if (!user_liked) {
      console.log('user_liked: ', user_liked);

      response(400, 'User not in the db', res);
    }
    let history = await getHistoryLikesID(user_liked[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getHistory/addLike');
      });
    console.log(history);
    await addLike(user_id, history[0].id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error addView/addView');
      });
    await updateFieldUser(user_liked[0].score + 10, 'score', user_id).catch((error) => {
      console.lof(error);

      return response(500, 'Internal error update score');
    });

    return response(200, 'viewed', res);
  },
  getLike: async(req, res, payload) => {
    let views = await getLike(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete");
      });

    return response(200, views, res);
  }
};
