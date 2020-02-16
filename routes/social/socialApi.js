const express = require('express');
const user = require('../../controllers/user');
const social = require('../../controllers/social');

const handlers = require('../../middleware/handlers');

const editSocial = express.Router();

editSocial.route('/view')
  .post((req, res) => {
    handlers.jwtCheck(req, res, social.addView);
  })
  .get((req, res) => {
    handlers.jwtCheck(req, res, social.getView);
  });

module.exports = editSocial;
