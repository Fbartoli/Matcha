// IMPORT
const usermodel = require('../models/usermodel');
const util = require('util');
// PROMISIFIED
const updateConnection = util.promisify(usermodel.updateFieldUsername);
const addNotification = util.promisify(usermodel.addNotification);

// CONSTANT
const ERROR = 'error';
const CHAT = 'chat';
const NOTIFICATION = 'notification';
const LIKE = 'like';
const VIEW = 'VIEW';
const LOGIN = 'login';
const DISCONNECT = 'disconnect';

// DATA
let UserOnlinecount = 0;
let userRegister = {};

const deleteKeyByValue = (obj, value) => Reflect.deleteProperty(userRegister, Object.keys(obj).find((key) => obj[key] === value));

exports.receivers = (io) => {

  io.on('connection', function(socket) {
    console.log(`Connection incoming: ${socket.id}`);
    UserOnlinecount += 1;
    socket.on(LOGIN, async function(username) {
      console.log(userRegister);
      await updateConnection('last_connection', new Date(Date.now()), username).then((data) => {
        if (data.affectedRows === 0) {
          // to turn into a notification
          io.to(socket.id).emit(CHAT, `${username} not found`);
        } else {
          userRegister[username] = socket.id;
          console.log(userRegister);
          io.emit(CHAT, `${username} is now connected with id ${socket.id}`);
        }
      })
        .catch((error) => {
          console.log(error);
          io.to(socket.id).emit(CHAT, 'Could not connect');
        });
    });
    socket.on(CHAT, /* async*/ function(username, user_target, msg) {
      console.log(`Chat message by ${username}: ${msg}`);
      if (userRegister[username]) {
        console.log('lol');
        // await addNotification(user_target, `user ${username} likes you`);
        io.to(userRegister[user_target]).emit(CHAT, `${username}: ${msg}`);
      } else {
        io.to(socket.id).emit('chat', 'Please login');
      }
    });
    socket.on(LIKE, async function(username, user_liked) {
      await addNotification(user_liked, `user ${username} likes you`);
      console.log(`you like ${user_liked}`);
      io.to(userRegister[user_liked]).emit(NOTIFICATION, `user ${username} likes you`);
      io.to(userRegister[username]).emit(NOTIFICATION, `you like ${user_liked}`);

    });
    socket.on(VIEW, async function(username, user_viewed) {
      await addNotification(user_viewed, `user ${username} viewed your profile`);
      io.emit(NOTIFICATION, `user ${username} viewed ${user_viewed}`);
    });
    socket.on(DISCONNECT, function() {
      console.log(`User disconnected ${socket.id}`);
      UserOnlinecount -= 1;
      deleteKeyByValue(userRegister, socket.id);
      console.log(userRegister);
      console.log(`${UserOnlinecount} connected`);
    });
  });
};
// handle different type of notification.
