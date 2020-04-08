const express = require('express');
const user = require('../../controllers/user');
const edit = require('../../controllers/edit');
const handlers = require('../../middleware/handlers');
const multer = require("multer");
let storage = handlers.storage;
let upload = multer({storage: storage});

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
usersRoute.post('/upload', upload.array('images', 5), (req, res) => {
  handlers.jwtCheck(req, res, edit.editPhoto);
});
usersRoute.get('/photos', (req, res) => {
  handlers.jwtCheck(req, res, edit.getPhoto);
});
// charger les informations de l'utilisateur connecté
usersRoute.route('/user')
  .post((req, res) => {
    handlers.jwtCheck(req, res, user.addUserInfo);
  })
  .get((req, res) => {
    handlers.jwtCheck(req, res, user.getUser);
  });
usersRoute.route('/profile')
  .get((req, res) => {
    handlers.jwtCheck(req, res, user.getOtherUser);
  });
module.exports = usersRoute;
