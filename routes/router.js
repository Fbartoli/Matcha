const express = require('express');
const usersRoute = require('./users/usersApi');
const editRoute = require('./users/editApi');
// const notifRoute = require('./users/notifapi');
// const socialRoute = require('./users/socialapi');


const router = express.Router();

router.use('/api/users/', usersRoute);
router.use('/api/edit/', editRoute);
// router.use('/api/notif/', notifRoute);
// router.use('/api/social/', socialRoute);


router.get('/api', function (req, res) {
  res.send({msg: 'Welcome to Matcha API'});
});

module.exports = router;
