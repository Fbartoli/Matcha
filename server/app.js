const express = require('express');
const CONFIG = require('./config/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const {addUser, removeUser, getUser, getUsersInRoom} = require('./controllers/chat');

const port = CONFIG.port;

const app = express();
const router = require('./router');


// middlewares

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(router);

// start server
let server = app.listen(port, '192.168.0.19', () => {
  console.log('Matcha API server started on: ' + port);
});
app.use(cors());

const io = require('socket.io').listen(server);

io.on('connection', (socket) => {
  console.log('Connected !');

  socket.on('join', ({name, room}, callback) => {
    const {error, user} = addUser({id:socket.id, name, room});

    if (error) {
      return callback(error);
    }

    socket.emit('message', {user: 'admin', text: `${user.name}, Welcome to the room ${user.room}]`});
    socket.join(user.room);
    socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined`});

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket, id);

    io.to(user.room).emit('message', {user: user.name, text: message});

    callback();
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
});
