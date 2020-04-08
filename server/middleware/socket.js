let io = null;

exports.set = function(socketio) {
  io = socketio;
};

exports.get = function() {
  return io;
};
