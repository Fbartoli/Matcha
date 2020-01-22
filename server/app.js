const express = require('express');
const CONFIG = require('./config/config');
const path = require('path');
const user = require('./controllers/user');

const app = express();
const port = CONFIG.port;

app.use(express.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.send('Welcome to the Matcha API');
});

app.route('/register')
    .get(function(req, res) {
      res.sendFile('index.html', {root: path.join(__dirname)});
    })
    .post(user.addUser);

app.route('/login')
    .get(function(req, res) {
      res.sendFile('login.html', {root: path.join(__dirname)});
    })
    .post(user.checkPassword);

app.route('/users')
    .get(user.getAllusers);

app.listen(port, () => {
  console.log('Matcha API server started on: ' + port);
});

