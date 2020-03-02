const express = require('express');
const handlers = require('../middleware/handlers');
const usersRoute = require('./users/usersApi');
const editRoute = require('./edit/editApi');
// const notifRoute = require('./users/notifapi');
const socialRoute = require('./social/socialApi');


const router = express.Router();

router.use('/api/users/', usersRoute);
router.use('/api/edit/', editRoute);
// router.use('/api/notif/', notifRoute);
router.use('/api/social/', socialRoute);


router.get('/', function (req, res) {
  res.sendFile('/Users/flbartol/Documents/Matcha/socket.html');
});
router.get('/api/refresh', function (req, res) {
  handlers.jwtRefresh(req, res);
});

module.exports = router;
