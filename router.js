const express = require('express');
const router = express.Router();
const user = require('./controllers/user');
const path = require('path');
const jwtcheck = require('./middleware/handlers');

router.get('/', function (req, res) {
  res.send({ msg: 'Welcome to the Matcha API' });
});

router.get('/activate', function (req, res) {
  user.activate(req, res);
});

router.route('/register')
  .get(function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname) });
  })
  .post(user.addUser);

router.route('/login')
  .get(function (req, res) {
    res.sendFile('login.html', { root: path.join(__dirname) });
  })
  .post(user.checkPassword);

router.route('/users')
  .get(function (req, res) {
    jwtcheck(req, res, user.getAllusers);
  });

router.route('/user')
  .get(function (req, res) {
    jwtcheck(req, res, user.getUser);
  });

module.exports = router;
