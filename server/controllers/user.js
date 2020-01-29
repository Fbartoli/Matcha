// include the model (aka DB connection)
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const CONFIG = require('../config/config');
const usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const mail = require('../utils/mail');


const MAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]*$/;
const NAME_REGEX = /^[a-zA-Z_.-]*$/;

const jwtkey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

// create class
const User = {
  getAllusers: function(req, res) {
    usermodel.getAllusers(req, function(err, result) {
      let apiResult = {};
      if (err) {
        apiResult.meta = {
          error: err,
        };
        apiResult.data = [];
      } else {
      let resultJson = JSON.stringify(result);
      resultJson = JSON.parse(resultJson);
      apiResult.meta = {
        table: 'user',
        total_entries: 0,
      };
      apiResult.data = resultJson;
      res.json(apiResult);
      }
    });
  },
  addUser: function(req, res) {
    let {username, name, surname, email, password} = req.body;
    console.log(req.body);
    const confirmation = uniqid();
    if (!(username || name || surname || email || password)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    if (!MAIL_REGEX.test(email)) {
      return res.status(400).json({error: 'Invalid mail.'});
    }
    if (!PASSWORD_REGEX.test(password) || password.length < 8) {
      return res.status(400).json({error: 'Invalid password, it should contain at least one capital letter, one numerical character and a minimun of 8 characters.'});
    }
    if (!USERNAME_REGEX.test(username) || username.length < 6) {
      return res.status(400).json({error: 'Invalid username, it should contain only letters, numbers and a minimun of 6 characters'});
    }
    if (!NAME_REGEX.test(name) || name.length < 2) {
      return res.status(400).json({error: 'Invalid name, it should contain only letters'});
    }
    if (!NAME_REGEX.test(surname) || surname.length < 2) {
      return res.status(400).json({error: 'Invalid surname, it should contain only letters'});
    }
    bcrypt.hash(password, 2, function(err, hash) {
      if (err) {
        console.log(err);

        return res.status(500).json({error: 'bcrypt popo' + err});
      }
      const post = [username, name, surname, email, hash, confirmation];
      let apiResult = {};
      usermodel.findOneUser('email', email, function(err, result) {
        if (err) {
          apiResult.meta = {
            error: err,
          };
          apiResult.data = [];
        } else {
          let resultJson = JSON.stringify(result);
          resultJson = JSON.parse(resultJson);
          if (resultJson[0]) {
            apiResult.meta = {
              error: 'email already exists'
           };
           apiResult.data = [];

           return res.json(apiResult);
          } else {
            usermodel.findOneUser('username', username, function(err, result) {
              if (err) {
                apiResult.meta = {
                  error: err,
                };
                apiResult.data = [];
              } else {
                let resultJson = JSON.stringify(result);
                resultJson = JSON.parse(resultJson);
                if (resultJson[0]) {
                  apiResult.meta = {
                    error: 'Username already exists'
                 };
                 apiResult.data = [];

                 return res.json(apiResult);
                } else {
                  usermodel.addUser(post, function(err, result) {
                    if (err) {
                      apiResult.meta = {
                        error: err,
                      };
                      apiResult.data = [];
                    } else {
                      let resultJson = JSON.stringify(result);
                      resultJson = JSON.parse(resultJson);
                      apiResult.meta = {
                        msg: 'user created',
                      };
                      apiResult.data = resultJson;
                      mail(email, 'activation link matcha', 'http://localhost:8080/activate?id=' + confirmation + '&username=' + username, null);
                    }

                    return res.json(apiResult);
                  });
                }
              }
            });
          }
        }
      });
    });
  },
  checkPassword: function(req, res) {
    let {username, password} = req.body;
    usermodel.findOneUser('username', username, function(err, result) {
      let apiResult = {};
      if (err) {
        apiResult.meta = {
          access: 'error',
          error: err,
        };
        apiResult.data = [];
      } else {
        let resultJson = JSON.stringify(result);
        resultJson = JSON.parse(resultJson);
        if (!resultJson[0]) {
          apiResult.meta = {
            access: 'denied',
            error: 'User not found',
          };
          apiResult.data = resultJson;
          res.status(401);
        } else if (resultJson[0].active === 0) {
          apiResult.meta = {
            access: 'denied',
            error: 'account not activated',
          };
          res.status(401);
        } else if (bcrypt.compareSync(password, resultJson[0].password)) {
          const token = jwt.sign({username}, jwtkey, {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
          });
          apiResult.meta = {
            access: 'granted',
            token: token
          };
          apiResult.data = resultJson;
          res.cookie('token', token, {
            maxAge: jwtExpirySeconds * 1000
          });
        } else {
          apiResult.meta = {
            access: 'denied',
            error: 'Wrong password',
          };
          apiResult.data = resultJson;
          res.status(401);
        }
      }

      return res.json(apiResult).end();
    });
  },
  activate: function(req, res) {
    const id = req.query.id;
    const username = req.query.id;
    let apiResult = {};
    if (!(username || id)) {
     return res.send('Invalid').redirect('/login');
    }
    usermodel.findOneUser('confirmation', id, function(err, result) {
      let resultJson = JSON.stringify(result);
      resultJson = JSON.parse(resultJson);
      if (err) {
        apiResult.meta = {
          error: err,
        };

        return res.send(apiResult);
      }

      if (!resultJson[0]) {
        apiResult.meta = {
          error: 'User already activated or wrong link',
        };

        return res.send(apiResult);
      }
      usermodel.activate(id, function(err) {
        if (err) {
          apiResult.meta = {
            error: err,
          };
          apiResult.data = [];

          return res.send(apiResult);
        }
        usermodel.updateConfirmation(id, function(err, result) {
          let resultJson = JSON.stringify(result);
          resultJson = JSON.parse(resultJson);
          if (err) {
            apiResult.meta = {
              error: err,
            };
            apiResult.data = [];

            return res.send(apiResult);
          }

          return res.redirect('/login');
        });
      });
    });
  }
};

module.exports = User;
