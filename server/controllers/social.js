const usermodel = require('../models/usermodel');
const sanitize = require('sanitize-html');
const util = require('util');
const handlers = require('../middleware/handlers');
const fs = require('fs');
const uniqid = require('uniqid');

const getPhoto = util.promisify(usermodel.getPhoto);

const addConversation = util.promisify(usermodel.addConversation);
const getConversationId = util.promisify(usermodel.getConversationId);
const addParticipants = util.promisify(usermodel.addParticipants);
const getMessages = util.promisify(usermodel.getMessages);

const getUser = util.promisify(usermodel.findOneUser);
const getFullProfile = util.promisify(usermodel.getFullProfile);
const getSearch = util.promisify(usermodel.findFilteredUsers);
const updateFieldUser = util.promisify(usermodel.updateFieldUser);

const getHistoryViewsID = util.promisify(usermodel.getHistoryViewsId);
const addView = util.promisify(usermodel.addView);
const getView = util.promisify(usermodel.getAllViews);

const getHistoryLikesID = util.promisify(usermodel.getHistoryLikesId);
const addLike = util.promisify(usermodel.addLike);
const getAllLikesReceived = util.promisify(usermodel.getAllLikesReceived);
const getAllLikesGiven = util.promisify(usermodel.getAllLikesGiven);
const delLike = util.promisify(usermodel.deleteLike);

const getHistoryReportsID = util.promisify(usermodel.getHistoryReportsId);
const addReport = util.promisify(usermodel.addReport);
const getReport = util.promisify(usermodel.getAllReports);

const getHistoryBlocksID = util.promisify(usermodel.getHistoryBlocksId);
const addBlock = util.promisify(usermodel.addBlock);
const getBlock = util.promisify(usermodel.getAllBlocks);

const getUserMatched = util.promisify(usermodel.getUserMatched);


const isMatching = util.promisify(usermodel.isMatch);
const isLiked = util.promisify(usermodel.isLiked);
const addMatch = util.promisify(usermodel.addMatch);
const addUsersMatch = util.promisify(usermodel.addUsersMatch);

const getTopProfil = util.promisify(usermodel.getTopProfil);

const getNotificationUnread = util.promisify(usermodel.getNotificationUnread);
const updateNotification = util.promisify(usermodel.updateNotification);
const getMatchId = util.promisify(usermodel.getMatchIdUsers);
const deleteMatch = util.promisify(usermodel.deleteMatch);

const algo = util.promisify(handlers.algo);
const Convertb64 = util.promisify(handlers.Convertb64);
// const getAllUsers = util.promisify(usermodel.getAllusers);


function response (status, message, res) {
  return res.status(status).json({client: message});
}


module.exports = {
  addView: async(req, res, payload) => {
    let user_id = payload.user_id;
    if (!req.body.username) {
      return response(400, 'No user provided', res);
    }
    let username = sanitize(req.body.username);
    try {
      let user_visited = await getUser('users.username', username).then((data) => data);
      if (!user_visited[0]) return response(400, 'User not in the db', res);
      let history = await getHistoryViewsID(user_visited[0].id).then((data) => data);
      await addView(user_id, history[0].id).then((data) => data);
      await updateFieldUser('score', user_visited[0].score + 5, user_id);
    } catch (error) {
      return response(500, 'Internal error update score', res);
    }

    return response(200, 'viewed', res);
  },
  getView: async(req, res, payload) => {
    let views = {};
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
    try {
      views = await getView(payload.user_id).then((data) => data);
    } catch (error) {
      return response(500, "Internal Error, getView requete", res);
    }

    return response(200, views, res);
  },
  addLike: async(req, res, payload) => {
    let user_id = payload.user_id;
    if (!req.body.username) {
      return response(400, 'No user provided', res);
    }
    let username = sanitize(req.body.username);
    if (!username) {
      return response(400, 'Missing username', res);
    }
    let message = '';
    let user_liked = {};
    try {
      user_liked = await getUser('users.username', username).then((data) => data);
      if (!user_liked[0]) return response(400, 'User not in the db', res);
      if (user_id === user_liked[0].id) return response(400, 'Cannot self like', res);
      let blocks = await getBlock(payload.user_id).then((data) => data);
      for (let ind = 0; ind < blocks.length; ind += 1) {
        let blocked_id = blocks[ind].user_blocked;
        if (user_liked[0].id === blocked_id) {
          return response(400, "Cannot like someone you blocked", res);
        }
      }
      let history = await getHistoryLikesID(user_liked[0].id).then((data) => data);
      let data = await isLiked(user_id, user_liked[0].id).then((data) => data);
      if (data.length > 0) {
        return response(400, 'User Already liked', res);
      }
      await addLike(user_id, history[0].id);
      await updateFieldUser(
        "score",
        user_liked[0].score + 10,
        user_liked[0].id
      );
      let match = await isMatching(user_id, user_liked[0].id).then((data) => data.length === 2);
      if (match === true) {
        let id = uniqid();
        await addMatch(id);
        await addUsersMatch(user_id, user_liked[0].id, id);
        id = uniqid();
        await addConversation(id);
        await addParticipants(user_id, user_liked[0].id, id);

        message = ` and matched with ${username}`;
      }
    } catch (error) {
      return response(500, 'Internal error isMatching', res);
    }

    return response(200, `Liked${message}`, res);
  },
  deleteLike: async(req, res, payload) => {
    let user_id = payload.user_id;
    let user = payload.username;
    let username = sanitize(req.body.username);
    let message = '';
    let history = {};
    let data = {};
    let user_liked = {};
    if (!username) {
      return response(400, 'Missing username', res);
    }
    try {
      user_liked = await getUser('users.username', username).then((data) => data);
      if (!user_liked[0]) {
        return response(400, 'User not in the db', res);
      }
      if (user_id === user_liked[0].id) {
        return response(400, 'Cannot self like', res);
      }
      history = await getHistoryLikesID(user_liked[0].id).then((data) => data);
      data = await isLiked(user_id, user_liked[0].id).then((data) => data);
      let match = await isMatching(user_id, user_liked[0].id).then((data) => data.length === 2);
      if (match === true) {
        let matchId = await getMatchId(user, username).then((data) => data[0].id);
        if (matchId) {
          await deleteMatch(matchId);
        }
        message = ` and unmatched with ${username}`;
      }
    } catch (error) {
      return response(500, 'Internal error getHistory/addLike', res);
    }
    if (data.length > 0) {
      try {
        await delLike(user_id, history[0].id);
        await updateFieldUser('score', user_liked[0].score - 10, user_id);
      } catch (error) {
        return response(500, 'Internal error getHistory/addLike', res);
      }

      return response(200, `Disliked${message}`, res);
    } else {
      return response(400, 'You need to like the user first', res);
    }
  },
  getLike: async(req, res, payload) => {
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
    let LikesReceived = {};
    let LikesGiven = {};
    try {
      LikesReceived = await getAllLikesReceived(payload.user_id).then((data) => data);
      LikesGiven = await getAllLikesGiven(payload.user_id).then((data) => data);
    } catch (error) {
      return response(500, "Internal Error, getLike requete", res);
    }

    return response(200, {received: LikesReceived,
      given: LikesGiven}, res);
  },
  addReport: async(req, res, payload) => {
    let user_id = payload.user_id;
    let username = sanitize(req.body.username);
    let user_reported = {};
    let history = {};
    if (!payload.user_id) {
      return response(400, 'Please LOGIN', res);
    }
    if (!username) {
      return response(400, 'No user provided', res);
    }
    try {
      user_reported = await getUser('users.username', username).then((data) => data[0]);
      if (!user_reported || !user_reported.id) {
        return response(400, 'User not in the db', res);
      }
      history = await getHistoryReportsID(user_reported.id).then((data) => data[0]);
      if (!history || !history.id) {
        return response(400, 'History id not found', res);
      }
      await addReport(user_id, history.id).then((data) => data);
      await updateFieldUser('score', user_reported.score - 10, user_id);
    } catch (error) {
      return response(500, 'Internal error update score', res);
    }

    return response(200, 'reported', res);
  },
  getReport: async(req, res, payload) => {
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
    let result = {};
    try {
      result = await getReport(payload.user_id).then((data) => data);
    } catch (error) {
      return response(500, "Internal Error, getView requete", res);
    }

    return response(200, result, res);
  },
  addBlock: async(req, res, payload) => {
    let user_id = payload.user_id;
    let username = sanitize(req.body.username);
    let user_blocked = {};
    let history = {};
    if (!username) {
      return response(400, 'No user provided', res);
    }
    try {
      user_blocked = await getUser('users.username', username).then((data) => data[0]);
      if (!user_blocked || !user_blocked.id) {
        return response(400, 'User not in the db', res);
      }
      history = await getHistoryBlocksID(user_blocked.id).then((data) => data[0]);
      if (!history || !history.id) {
        return response(400, 'History id not found', res);
      }
      await addBlock(user_id, history.id).then((data) => data);
      await updateFieldUser('score', user_blocked.score - 20, user_id);
    } catch (error) {
      return response(500, 'Internal error update score', res);
    }

    return response(200, 'Blocked', res);
  },
  getBlock: async(req, res, payload) => {
    if (!payload.user_id) {
      return response(400, 'You are not connected', res);
    }
    let results = {};
    try {
      results = await getBlock(payload.user_id).then((data) => data);
    } catch (error) {
      return response(500, "Internal Error, getView requete", res);
    }

    return response(200, results, res);
  },
  // scoring weight based on differences
  // sexual orientation 0 if exact 100 if not matching
  // distance 0.1 per meters
  // interest 10 per unmatched interest
  // score difference 0.01 per pts
  getPotentialMatch: async(req, res, payload) => {
    let user_id = payload.user_id;
    let number = parseInt(req.query.number, 10);
    let user = {};
    let users = {};
    if (typeof number !== 'number' || isNaN(number)) {
      return response(400, 'Please provide the amount of results desired', res);
    }
    try {
      user = await getFullProfile(user_id).then((data) => data[0]);
      if (!payload.user_id) {
        return response(400, 'You are not connected', res);
      }
      if (!user) {
        return response(500, 'User not found', res);
      }
      users = await getTopProfil(user_id, user).then((data) => data);
      if (!users[0]) {
        return response(200, 'no potential mate, natural selection bitch', res);
      }
      let blocks = await getBlock(payload.user_id).then((data) => data);
      users.unshift(user);
      for (let index = 0; index < users.length; index += 1) {
        await algo(users[index], user).then((data) => data);
      }
      users.shift();
      if (number > users.length) {
        number = users.length;
      }
      for (let index = 0; index < blocks.length; index += 1) {
        users = users.filter((user) => user.id !== blocks[index].user_blocked);
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
      for (let index = 0; index < result.length; index += 1) {
        let photos = await getPhoto(result[index].id).then((data) => data);
        try {
          photos[0].link = Buffer.from(fs.readFileSync(photos[0].link)).toString('base64');
          result[index].photo = photos[0].link;
          Reflect.deleteProperty(result, 'id');
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      return response(500, 'Internal error', res);
    }

    return response(200, {length: users.length,
      data: users}, res);
  },
  getSearch: async(req, res, payload) => {
    let user_id = payload.user_id;
    let age = req.query.age.split(',');
    let popularity = req.query.popularity.split(',');
    let distance = req.query.distance;
    let tags = req.query.tags.split(',');
    let gender = req.query.gender;
    let user = {};
    let results = {};
    if (!age || !distance || !popularity || !tags || !user_id || !gender) {
      return response(400, 'missing parameters', res);
    }
    try {
      user = await getFullProfile(user_id).then((data) => data[0]);
      let info = [age[0], age[1], popularity[0], popularity[1], user.id];
      results = await getSearch(info, gender).then((data) => data);
      let blocks = await getBlock(payload.user_id).then((data) => data);
      for (let index = 0; index < results.length; index += 1) {
        await handlers.getDistancePro(results[index], user).then((data) => data);
        for (let ind = 0; ind < blocks.length; ind += 1) {
          let blocked_id = blocks[ind].user_blocked;
          if (results[index].id === blocked_id) {
            results.splice(index, 1);
          }
        }
        let photos = await Convertb64(results[index]).then((data) => data);
        results[index].photo = photos;
      }
      results = results.filter((result) => result.distance < distance);
      for (let index = 0; index < tags.length; index += 1) {
        results = results.filter((result) => result.hobbies.includes(tags[index]));
      }
    } catch (error) {
      return response(500, 'Internal error', res);
    }

    return response(200, {
      length: results.length,
      data: results}, res);
  },
  getMatchedUser: async(req, res, payload) => {
    let user_id = payload.user_id;
    let result = {};
    try {
      result = await getUserMatched(user_id).then((data) => data);
      for (let index = 0; index < result.length; index += 1) {
        result[index].conversationId = await getConversationId(user_id, result[index].id).then((data) => data[0].conversation_id);
      }
    } catch (error) {
      return response(500, 'Internal error', res);
    }

    return response(200, result, res);
  },
  getNotification: async(req, res, payload) => {
    let username = payload.username;
    let result = {};
    try {
      result = await getNotificationUnread(username).then((data) => data);
    } catch (error) {
      return response(500, 'Internal error', res);
    }

    return response(200, result, res);
  },
  readNotification: async(req, res) => {
    let id = req.body.notificationId;
    if (!id) {
      return response(400, 'missing informations', res);
    }
    try {
      await updateNotification(id).then((data) => data);
    } catch (error) {
      return response(500, 'Internal error', res);
    }

    return response(200, 'OK', res);
  },
  getMessages: async(req, res) => {
    let conversation_id = req.query.conversation_id;
    let result = {};
    try {
      result = await getMessages(conversation_id).then((data) => data);
    } catch (error) {
      return response(500, 'Internal error', res);
    }
    console.log(result);

    return response(200, result, res);
  }
};
