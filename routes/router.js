const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const path = require('path');
const handlers = require('../middleware/handlers');

router.get('/', function (req, res) {
  res.send({msg: 'Welcome to the Matcha API'});
});

router.get('/activate', function (req, res) {
  user.activate(req, res);
});

router.route('/reset')
  .post(user.resetPasswordEmail);

// remove gets because handled front side
router.route('/register')
  .get(function (req, res) {
    res.sendFile('/index.html', {root: path.join(__dirname)});
  })
  .post(user.addUser);

// remove gets because handled front side
router.route('/login')
  .get(function (req, res) {
    res.sendFile('/login.html', {root: path.join(__dirname)});
  })
  .post(user.checkPassword);

router.route('/password')
  .get(function (req, res) {
    continue
  })
  .post(user.checkPassword);

router.route('/users')
  .get(function (req, res) {
    handlers.jwtCheck(req, res, user.getAllusers);
  });

router.route('/user')
  .get(function (req, res) {
    handlers.jwtCheck(req, res, user.getUser);
  });

module.exports = router;
