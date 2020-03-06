// IMPORT
const usermodel = require('../models/usermodel');
const util = require('util');
const uniqid = require('uniqid');
// PROMISIFIED
const updateConnection = util.promisify(usermodel.updateFieldUsername);
const addNotification = util.promisify(usermodel.addNotification);
const addMessages = util.promisify(usermodel.addMessages);
const getUserInfo = util.promisify(usermodel.getUserId);
const getConversationId = util.promisify(usermodel.getConversationId);

// CONSTANT
const CHAT = 'chat';
const NOTIFICATION = 'notification';
const LIKE = 'like';
const LIKEBACK = 'likeback';
const VIEW = 'view';
const LOGIN = 'login';
const DISLIKE = 'dislike';
const DISCONNECT = 'disconnect';
const JOIN = 'join';

// DATA
let UserOnlinecount = 0;
let userRegister = {};
let chatRoom = {};

const deleteKeyByValue = (obj, value) => Reflect.deleteProperty(userRegister, Object.keys(obj).find((key) => obj[key] === value));

exports.receivers = (io) => {

  io.on('connection', function(socket) {
    UserOnlinecount += 1;
    socket.on(LOGIN, async function(username) {
      // handle different type of notification.
      let user_id = await getUserInfo(username).then((data) => data[0].id)
        .catch((error) => {
          console.log(error);
        });
      await updateConnection('last_connection', new Date(Date.now()), username).then((data) => {
        if (data.affectedRows === 0) {
          io.to(socket.id).emit(CHAT, `${username} not found`);
        } else {
          userRegister[username] = {socket: socket.id,
            user_id: user_id};
          io.emit(CHAT, `${username} is now connected with id ${socket.id}`);
        }
      })
        .catch((error) => {
          console.log(error);
          io.to(socket.id).emit(CHAT, 'Could not connect');
        });
    });
    socket.on(CHAT, async function(username, user_target, msg) {
      let user_target_id = await await getUserInfo(username).then((data) => data[0].id)
        .catch((error) => {
          console.log(error);
        });
      if (userRegister[username]) {
        let id = uniqid();
        await addNotification(id, user_target, `user ${username} sent you a message`).catch((error) => {
          console.log(error);
        });
        let conversationId = await getConversationId(userRegister[username].user_id, user_target_id).then((data) => data[0].conversation_id)
          .catch((error) => {
            console.log(error);
            io.to(socket.id).emit(NOTIFICATION, {message: 'COULD NOT SEND THE MESSAGE',
              id: id});
          });
        console.log(`${username} : ${userRegister[username].user_id} : ${msg} : ${conversationId}`);
        await addMessages(userRegister[username].user_id, msg, conversationId).then((data) => console.log(data))
          .catch((error) => {
            console.log(error);
          });
        if (userRegister[user_target]) {
          io.to(userRegister[user_target].socket).emit(CHAT, `${username}: ${msg}`);
        }
        if (userRegister[username]) {
          io.to(userRegister[username].socket).emit(CHAT, `${username}: ${msg}`);
        }
      } else {
        io.to(socket.id).emit(NOTIFICATION, {message: 'Please login again'});
      }
    });
    socket.on(LIKE, async function(username, user_liked) {
      let id = uniqid();
      await addNotification(id, user_liked, `user ${username} likes you`);
      console.log(`you like ${user_liked}`);
      if (userRegister[user_liked]) {
        io.to(userRegister[user_liked].socket).emit(NOTIFICATION, {message: `user ${username} likes you`,
          id: id});
      }
    });
    socket.on(LIKEBACK, async function(username, user_liked) {
      let id = uniqid();
      await addNotification(id, user_liked, {message: `user ${username} likes you back, it's a match`});
      console.log(`you liked ${user_liked}`);
      if (userRegister[user_liked]) {
        io.to(userRegister[user_liked].socket).emit(NOTIFICATION, {message: `you are matched with ${username}`,
          id: id});
      }
      if (userRegister[username]) {
        io.to(userRegister[username].socket).emit(NOTIFICATION, {message: `match with ${user_liked}`,
          id: id});
      }
    });
    socket.on(VIEW, async function(username, user_viewed) {
      let id = uniqid();
      await addNotification(id, user_viewed, `user ${username} viewed your profile`);
      if (userRegister[user_viewed]) {
        io.to(userRegister[user_viewed].socket).emit(NOTIFICATION, {message: `user ${username} viewed ${user_viewed}`,
          id: id});
      }
    });
    socket.on(DISLIKE, async function(username, user_viewed) {
      let id = uniqid();
      await addNotification(id, user_viewed, `user ${username} viewed your profile`);
      if (userRegister[user_viewed]) {
        io.to(userRegister[user_viewed].socket).emit(NOTIFICATION, {message: `${username} doesn't like you anymore`,
          id: id});
      }
    });
    socket.on(DISCONNECT, function() {
      console.log(`User disconnected ${socket.id}`);
      UserOnlinecount -= 1;
      deleteKeyByValue(userRegister, socket.id);
      console.log(`${UserOnlinecount} connected`);
    });
  });
};
