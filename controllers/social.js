// include the model (aka DB connection)
const usermodel = require('../models/usermodel');
const sanitize = require('sanitize-html');
const util = require('util');
const fs = require('fs');
const sharp = require('sharp');
const path = require("path");
const rootDir = path.dirname(require.main.filename || process.mainModule.filename);
// const handlers = require('../middleware/handlers');

const getUser = util.promisify(usermodel.findOneUser);
const getHistoryID = util.promisify(usermodel.getHistoryId);
const addView = util.promisify(usermodel.addView);
const getView = util.promisify(usermodel.getAllViews);
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
    let history = await getHistoryID(user_visited[0].id).then((data) => data)
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

    return response(200, 'viewed', res);
  },
  getView: async(req, res, payload) => {
    let views = await getView(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete");
      });

    return response(200, views, res);
  }
};
