const express = require('express');
const user = require('../../controllers/user');
const storage = require('../../uploads/uploads-config');
const crypto = require('crypto');
const multer = require('multer');
const upload = multer(storage);
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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

// usersRoute.post('/upload', upload.single('image'), async (req, res) => {
//   const {filename: image} = (req, file, callback) => {
//     crypto.pseudoRandomBytes(16, function(err, raw) {
//       if (err) return callback(err);

//       callback(null, raw.toString('hex') + path.extname(file.originalname));
//     });
//   };

//   await sharp(req.file.path)
//     .resize(500)
//     .jpeg({quality: 50})
//     .toFile(path.resolve(req.file.destination, './uploads/resized', image));
//   fs.unlinkSync(req.file.path);

//   return res.send('SUCCESS!');
// });

// Routes protegées

// charger les informations de l'utilisateur connecté
usersRoute.route('/user')
  .post(function (req, res) {
    handlers.jwtCheck(req, res, user.addUserInfo);
  })
  .get(function (req, res) {
    handlers.jwtCheck(req, res, user.getUser);
  });

module.exports = usersRoute;
