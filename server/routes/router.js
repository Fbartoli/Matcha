const express = require('express');
const handlers = require('../middleware/handlers');
const usersRoute = require('./users/usersApi');
const editRoute = require('./edit/editApi');
const socialRoute = require('./social/socialApi');


const router = express.Router();

router.use('/api/users/', usersRoute);
router.use('/api/edit/', editRoute);
router.use('/api/social/', socialRoute);
router.get('/api/refresh', function (req, res) {
  handlers.jwtRefresh(req, res);
});

module.exports = router;
