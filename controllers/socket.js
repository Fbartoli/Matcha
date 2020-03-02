const ERROR = 'error';
const CHAT = 'chat';
const NOTIFICATION = 'notification';
const LIKE = 'like';
const VIEW = 'VIEW';
const LOGIN = 'login';
const DISCONNECT = 'disconnect';
let UserOnlinecount = 0;

exports.receivers = (io) => {

  io.on('connection', function(socket) {
    console.log(`Connection incoming: ${socket.id}`);
    socket.on(LOGIN, function(username) {
      UserOnlinecount += 1;
      io.emit(CHAT, `${username} is now connected`);
    });
    socket.on(CHAT, function(username, msg) {
      if (username) {
        io.emit(CHAT, `${username}: ${msg}`);
      } else {
        io.to(socket.id).emit('chat message', 'Please login');
      }
    });
    socket.on(LIKE, function(username, user_liked) {
      io.emit(CHAT, `user ${username} liked ${user_liked}`);
    });
    socket.on(VIEW, function(username, user_liked) {
      io.emit(CHAT, `user ${username} liked ${user_liked}`);
    });
    socket.on(DISCONNECT, function() {
      console.log(`User disconnected ${socket.id}`);
      UserOnlinecount -= 1;
      console.log(`${UserOnlinecount} connected`);
    });
  });
};
// handle different type of notification.
