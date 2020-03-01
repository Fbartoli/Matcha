const usermodel = require('../models/usermodel');
const sanitize = require('sanitize-html');
const util = require('util');
const handlers = require('../middleware/handlers');
const fs = require('fs');

const getPhoto = util.promisify(usermodel.getPhoto);

const getUser = util.promisify(usermodel.findOneUser);
const getFullProfile = util.promisify(usermodel.getFullProfile);
const getSearch = util.promisify(usermodel.findFilteredUsers);
const updateFieldUser = util.promisify(usermodel.updateFieldUser);

const getHistoryViewsID = util.promisify(usermodel.getHistoryViewsId);
const addView = util.promisify(usermodel.addView);
const getView = util.promisify(usermodel.getAllViews);

const getHistoryLikesID = util.promisify(usermodel.getHistoryLikesId);
const addLike = util.promisify(usermodel.addLike);
const getLike = util.promisify(usermodel.getAllLikes);

const getHistoryReportsID = util.promisify(usermodel.getHistoryReportsId);
const addReport = util.promisify(usermodel.addReport);
const getReport = util.promisify(usermodel.getAllReports);

const getHistoryBlocksID = util.promisify(usermodel.getHistoryBlocksId);
const addBlock = util.promisify(usermodel.addBlock);
const getBlock = util.promisify(usermodel.getAllBlocks);

const isMatching = util.promisify(usermodel.isMatch);
const isLiked = util.promisify(usermodel.isLiked);
const addMatch = util.promisify(usermodel.addMatch);
const addUsersMatch = util.promisify(usermodel.addUsersMatch);

const getLastId = util.promisify(usermodel.lastIdInsert);
const getTopProfil = util.promisify(usermodel.getTopProfil);

const algo = util.promisify(handlers.algo);
const Convertb64 = util.promisify(handlers.Convertb64);
// const getAllUsers = util.promisify(usermodel.getAllusers);


function response (status, message, res) {
  return res.status(status).json({client: message});
}


module.exports = {
  addView: async(req, res, payload) => {
    let user_id = payload.user_id;
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
    await updateFieldUser('score', user_visited[0].score + 5, user_id).catch((error) => {
      console.lof(error);

      return response(500, 'Internal error update score', res);
    });

    return response(200, 'viewed', res);
  },
  getView: async(req, res, payload) => {
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
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
    let blocks = await getBlock(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete", res);
      });
    for (let ind = 0; ind < blocks.length; ind += 1) {
      let blocked_id = blocks[ind].user_reported;
      if (user_liked[0].id === blocked_id) {
        return response(400, "Cannot like someone you blocked", res);
      }
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
    await updateFieldUser('score', user_liked[0].score + 10, user_id).catch((error) => {
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
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
    let views = await getLike(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getLike requete", res);
      });

    return response(200, views, res);
  },
  addReport: async(req, res, payload) => {
    let user_id = payload.user_id;
    let username = sanitize(req.body.username);
    if (!username) {
      return response(400, 'No user provided', res);
    }
    let user_reported = await getUser('users.username', username).then((data) => data[0])
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    if (!user_reported || !user_reported.id) {

      return response(400, 'User not in the db', res);
    }
    let history = await getHistoryReportsID(user_reported.id).then((data) => data[0])
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getHistory/addView', res);
      });
    if (!history || !history.id) {
      console.log(history);

      return response(400, 'History id not found', res);
    }
    await addReport(user_id, history.id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error addView/addView', res);
      });
    await updateFieldUser('score', user_reported.score - 10, user_id).catch((error) => {
      console.log(error);

      return response(500, 'Internal error update score', res);
    });

    return response(200, 'reported', res);
  },
  getReport: async(req, res, payload) => {
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
    let result = await getReport(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete", res);
      });

    return response(200, result, res);
  },
  addBlock: async(req, res, payload) => {
    let user_id = payload.user_id;
    let username = sanitize(req.body.username);
    if (!username) {
      return response(400, 'No user provided', res);
    }
    let user_blocked = await getUser('users.username', username).then((data) => data[0])
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    if (!user_blocked || !user_blocked.id) {

      return response(400, 'User not in the db', res);
    }

    let history = await getHistoryBlocksID(user_blocked.id).then((data) => data[0])
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error getHistory/addView', res);
      });
    if (!history || !history.id) {

      return response(400, 'History id not found', res);
    }
    await addBlock(user_id, history.id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error addView/addView', res);
      });
    await updateFieldUser('score', user_blocked.score - 20, user_id).catch((error) => {
      console.log(error);

      return response(500, 'Internal error update score', res);
    });

    return response(200, 'Blocked', res);
  },
  getBlock: async(req, res, payload) => {
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
    let results = await getBlock(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete", res);
      });

    return response(200, results, res);
  },
  // scoring weight based on differences
  // sexual orientation 0 if exact 100 if not matching
  // distance 0.1 per meters
  // interest 10 per unmatched interest
  // score difference 0.01 per pts
  getPotentialMatch: async(req, res, payload) => {
    let user_id = payload.user_id;
    let number = req.query.number;
    let user = await getFullProfile(user_id).then((data) => data[0])
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
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
    let blocks = await getBlock(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete", res);
      });
    users.unshift(user);
    for (let index = 0; index < users.length; index += 1) {
      for (let ind = 0; ind < blocks.length; ind += 1) {
        let blocked_id = blocks[ind].user_blocked;
        if (users[index].id === blocked_id) {
          users.splice(index, 1);
        } else {
          await algo(users[index], user).then((data) => data)
            .catch((error) => {
              console.log(error);

              return response(500, 'Internal error', res);
            });
        }
      }
    }
    users.shift();
    if (number > users.length) {
      number = users.length;
    }
    users = users.splice(0, number);
    let result = users.sort(function compare(user1, user2) {
      if (user1.matchScore < user2.matchScore) {
        return -1;
      }
      if (user1.matchScore > user2.matchScore) {
        return 1;
      }

      return 0;
    });
    console.log(result);
    for (let index = 0; index < result.length; index += 1) {
      let photos = await getPhoto(result[index].id).then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error', res);
        });
      try {
        photos[0].link = Buffer.from(fs.readFileSync(photos[0].link)).toString('base64');
        result[index].photo = photos[0].link;
        Reflect.deleteProperty(result, 'id');
      } catch (error) {
        console.log(error);

        return response(404, 'File not available', res);
      }
    }

    return response(200, {length: number,
      data: result}, res);
  },
  getSearch: async(req, res, payload) => {
    let user_id = payload.user_id;
    let age = req.query.age.split(',');
    let popularity = req.query.popularity.split(',');
    let distance = req.query.distance;
    let tags = req.query.tags.split(',');
    let gender = req.query.gender;
    if (!age || !distance || !popularity || !tags || !user_id || !gender) {
      return response(400, 'missing parameters', res);
    }
    let user = await getFullProfile(user_id).then((data) => data[0])
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    if (!user) {
      return response(500, 'User not found', res);
    }
    let info = [age[0], age[1], popularity[0], popularity[1]];
    let results = await getSearch(info, gender).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    let blocks = await getBlock(payload.user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, "Internal Error, getView requete", res);
      });
    for (let index = 0; index < results.length; index += 1) {
      await handlers.getDistancePro(results[index], user).then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error', res);
        });
      for (let ind = 0; ind < blocks.length; ind += 1) {
        let blocked_id = blocks[ind].user_blocked;
        if (results[index].id === blocked_id) {
          results.splice(index, 1);
        }
      }
      let photos = await Convertb64(results[index]).then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, 'Internal error', res);
        });
      results[index].photos = photos;
    }
    results = results.filter((result) => result.distance < distance);
    for (let index = 0; index < tags.length; index += 1) {
      results = results.filter((result) => result.hobbies.includes(tags[index]));
    }

    return response(200, {
      length: results.length,
      data: results}, res);
  },
};
