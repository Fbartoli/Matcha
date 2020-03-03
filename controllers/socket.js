const ERROR = 'error';
const CHAT = 'chat';
const NOTIFICATION = 'notification';
const LIKE = 'like';
const VIEW = 'VIEW';
const LOGIN = 'login';
const DISCONNECT = 'disconnect';
let UserOnlinecount = 0;
let userRegister = {};
const deleteKeyByValue = (obj, value) => Reflect.deleteProperty(userRegister, Object.keys(obj).find((key) => obj[key] === value));

exports.receivers = (io) => {

  io.on('connection', function(socket) {
    console.log(`Connection incoming: ${socket.id}`);
    UserOnlinecount += 1;
    socket.on(LOGIN, function(username) {
      userRegister[username] = socket.id;
      console.log(userRegister);
      console.log(`${UserOnlinecount} connected`);
      io.emit(CHAT, `${username} is now connected with id ${socket.id}`);
    });
    socket.on(CHAT, function(username, msg) {
      if (username) {
        io.emit(CHAT, `${username}: ${msg}`);
      } else {
        io.to(socket.id).emit('chat message', 'Please login');
      }
    });
    socket.on(LIKE, function(username, user_liked) {
      io.to(userRegister[user_liked]).emit(NOTIFICATION, `user ${username} likes you`);
      io.to(userRegister[username]).emit(NOTIFICATION, `you like ${user_liked}`);

    });
    socket.on(VIEW, function(username, user_liked) {
      io.emit(NOTIFICATION, `user ${username} viewed ${user_liked}`);
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
