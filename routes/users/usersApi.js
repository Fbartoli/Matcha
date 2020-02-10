const express = require('express');
const user = require('../../controllers/user');

const handlers = require('../../middleware/handlers');

const usersRoute = express.Router();

// Routes non protegées

usersRoute.get('/activate', function (req, res) {
  return user.activate(req, res);
});

// Connexion de l'utilisateur
usersRoute.route('/login')
  .post(user.checkPassword);

// Demander une reinitialisation de mot de passe
usersRoute.route('/reset')
  .post(user.resetPasswordEmail);

// Ajouter un utilisateur
usersRoute.route('/register')
  .post(user.addUser);

// Changer le mot de passe et si l'utilisateur à enregistré un reset de mot de passe
usersRoute.route('/password')
  .get(user.isPasswordReset)
  .post(user.PasswordReset);


// Routes protegées

// charger les informations de l'utilisateur connecté
usersRoute.route('/user')
  .post(function (req, res) {
    handlers.jwtCheck(req, res, user.addUserInfo);
  })
  .get(function (req, res) {
    handlers.jwtCheck(req, res, user.getUser);
  });

usersRoute.route('/update')
  .post(function (req, res) {
    handlers.jwtCheck(req, res, user.addUserInfo);
  });

module.exports = usersRoute;