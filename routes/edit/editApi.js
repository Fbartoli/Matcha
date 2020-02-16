const express = require('express');
const user = require('../../controllers/user');

const handlers = require('../../middleware/handlers');

const editRoute = express.Router();

editRoute.route('/email')
  .post((req, res) => {
    handlers.jwtCheck(req, res, user.editEmail);
  });
editRoute.route('/bio')
  .post((req, res) => {
    handlers.jwtCheck(req, res, user.editBio);
  });
editRoute.route('/gender')
  .post((req, res) => {
    handlers.jwtCheck(req, res, user.editGender);
  });
editRoute.route('/password')
  .post((req, res) => {
    handlers.jwtCheck(req, res, user.editPassword);
  });

module.exports = editRoute;
