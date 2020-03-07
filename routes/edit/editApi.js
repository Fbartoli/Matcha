const express = require('express');
const user = require('../../controllers/user');
const edit = require('../../controllers/edit');

const handlers = require('../../middleware/handlers');

const editRoute = express.Router();

// Bio : string
editRoute.route('/bio')
  .post((req, res) => {
    handlers.jwtCheck(req, res, edit.editBio);
  });
// gender ID from 1 to 3
editRoute.route('/gender')
  .post((req, res) => {
    handlers.jwtCheck(req, res, edit.editGender);
  });
// User input : password / password2
editRoute.route('/password')
  .post((req, res) => {
    handlers.jwtCheck(req, res, user.editPassword);
  });
// User input : json location
editRoute.route('/location')
  .post((req, res) => {
    handlers.jwtCheck(req, res, edit.editLocation);
  });

module.exports = editRoute;
