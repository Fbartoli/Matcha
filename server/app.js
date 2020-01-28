const express = require('express');
const CONFIG = require('./config/config');
const path = require('path');
const user = require('./controllers/user');
const jwtcheck = require('./middleware/handlers');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const port = CONFIG.port;

// middlewares

app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://10.13.11.21:3000/',
  optionsSuccessStatus: 200,
};

// routes

app.get('/', function(req, res) {
  res.send('Welcome to the Matcha API');
});

app.get('/activate', function(req, res) {
  user.activate(req, res);
});

app.route('/register')
    .get(function(req, res) {
      res.sendFile('index.html', {root: path.join(__dirname)});
    })
    .post(user.addUser);

app.route('/login')
    .get(cors(corsOptions), function(req, res) {
      res.sendFile('login.html', {root: path.join(__dirname)});
    })
    .post(user.checkPassword);

app.route('/users')
    .get(function(req, res) {
      jwtcheck(req, res, user.getAllusers);
    });

// start server
app.listen(port, () => {
  console.log('Matcha API server started on: ' + port);
});
