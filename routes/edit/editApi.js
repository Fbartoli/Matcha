const express = require('express');
const user = require('../../controllers/user');
const edit = require('../../controllers/edit');

const handlers = require('../../middleware/handlers');

const editRoute = express.Router();

editRoute.route('/email')
  .post((req, res) => {
    handlers.jwtCheck(req, res, user.editEmail);
  });
editRoute.route('/bio')
  .post((req, res) => {
    handlers.jwtCheck(req, res, edit.editBio);
  });
editRoute.route('/gender')
  .post((req, res) => {
    handlers.jwtCheck(req, res, edit.editGender);
  });
editRoute.route('/password')
  .post((req, res) => {
    handlers.jwtCheck(req, res, edit.editPassword);
  });
editRoute.route('/location')
  .post((req, res) => {
    handlers.jwtCheck(req, res, edit.editLocation);
  });

module.exports = editRoute;
