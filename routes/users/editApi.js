const express = require('express');
const user = require('../../controllers/user');

const handlers = require('../../middleware/handlers');

const editRoute = express.Router();

editRoute.route('/email')
  .post(user.editEmail);

module.exports = editRoute;
