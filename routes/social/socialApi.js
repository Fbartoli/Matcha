const express = require('express');
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
editSocial.route('/like')
  .post((req, res) => {
    handlers.jwtCheck(req, res, social.addLike);
  })
  .get((req, res) => {
    handlers.jwtCheck(req, res, social.getLike);
  });
editSocial.route('/block')
  .post((req, res) => {
    handlers.jwtCheck(req, res, social.addBlock);
  })
  .get((req, res) => {
    handlers.jwtCheck(req, res, social.getBlock);
  });
editSocial.route('/report')
  .post((req, res) => {
    handlers.jwtCheck(req, res, social.addReport);
  })
  .get((req, res) => {
    handlers.jwtCheck(req, res, social.getReport);
  });
editSocial.route('/potential')
  .get((req, res) => {
    handlers.jwtCheck(req, res, social.getPotentialMatch);
  });
editSocial.route('/search')
  .get((req, res) => {
    handlers.jwtCheck(req, res, social.getSearch);
  });
module.exports = editSocial;
