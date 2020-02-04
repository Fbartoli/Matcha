// include the model (aka DB connection)
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const CONFIG = require('../config/config');
const usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const mail = require('../utils/mail');
const sanitize = require('sanitize-html');
const util = require('util');


const MAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]*$/;
const NAME_REGEX = /^[a-zA-Z_.-]*$/;

const jwtkey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

// create class
const User = {
  getAllusers: async(req, res) =>{
    const getAllUsers = util.promisify(usermodel.getAllusers);
    const allUsers = await getAllUsers(req).then(data => data).catch(err => { res.status(303).json({ error: err.error }); });
    console.log(allUsers);
    let apiResult = {};
    let resultJson = JSON.stringify(allUsers);
    resultJson = JSON.parse(resultJson);
    apiResult.meta = {
      table: 'user',
      total_entries: 0,
    };
    apiResult.data = resultJson;
    res.json(apiResult);
  },
  getUser: async(req, res) => {
    console.log(req);
    const getUser = util.promisify(usermodel.findOneUser)
    const user = await getUser('id', req.cookies.user_id).then(data => data).catch(err => { res.status(303).json({ error: err.error }); });
    console.log(user);
    let apiResult = {};
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    apiResult.meta = {
      table: 'user',
      total_entries: 0,
    };
    apiResult.data = resultJson;
    res.json(apiResult);
  },
  addUser: async(req, res) => {
    let {username, name, surname, email, password} = req.body;
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
      return res.status(400).json({error: 'Invalid surname, it should contain only letters and it should be longer that 2 characters'});
    }
    let apiResult = {};
    let getUser = util.promisify(usermodel.findOneUser);
    let user = await getUser('email', email).then(data => data).catch(error => { throw new Error(error)});
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (resultJson[0]) {
      apiResult.meta = {
        error: 'Email already exists'
      };
    apiResult.data = [];
    return res.status(303).json(apiResult);
    };
    getUser = util.promisify(usermodel.findOneUser);
    user = await getUser('username', username).then(data => data).catch(error => { throw new error(error) });
    resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (resultJson[0]) {
      apiResult.meta = {
        error: 'Username already exists'
      };
      apiResult.data = [];
      return res.status(303).json(apiResult);
    };
    const hashFct = util.promisify(bcrypt.hash);
    const hash = await hashFct(password, 2).then(data => data).catch(error => { throw new Error(error)});
    const post = [username, name, surname, email, hash, confirmation];
    const addUser = util.promisify(usermodel.addUser);
    await addUser(post).then(data => data).catch(error => {return res.status(500).json({error: error})});
    mail(email, 'activation link matcha', 'http://' + req.get("host") + '/activate?id=' + confirmation + '&username=' + username, null);
    return res.status(200).json({message: 'accepted'});
  },
  // async await needed
  addUserInfo: async(req, res) => {
    let {username, name, surname, email, password} = req.body;
    console.log(req.body);
    const confirmation = uniqid();
    if (!(username || name || surname || email || password)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    const info = [sanitize(username), sanitize(name), sanitize(surname), sanitize(email), sanitize(confirmation)];
    let apiResult = {};
    usermodel.findOneUser('id', req.cookies.user_id, function(err, result) {
      if (err) {
        apiResult.meta = {
          error: err,
        };
        apiResult.data = [];
      } else {
        let resultJson = JSON.stringify(result);
        resultJson = JSON.parse(resultJson);
        if (!resultJson[0]) {
          apiResult.meta = {
            error: 'User not found'
          };
          apiResult.data = [];

          return res.json(apiResult);
        } else {
          usermodel.updateUser(req.cookies.user_id, info, function(err, result) {
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

              return res.json(apiResult);
            }
          });
        }
      }
    });
  },
  checkPassword: async(req, res) => {
    let {username, password} = req.body;
    let getUser = util.promisify(usermodel.findOneUser);
    let user = await getUser('username', username).then(data => data).catch(error => { throw new Error(error)});
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    let apiResult = {}
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
        error: 'Account not activated',
      };
      res.status(401).json(apiResult);
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
        maxAge: jwtExpirySeconds
      });
      res.cookie('user_id', resultJson[0].id, {
        maxAge: jwtExpirySeconds
      });
    } else {
      apiResult.meta = {
        access: 'denied',
        error: 'Wrong password',
      };
      apiResult.data = resultJson;
      res.status(401);
    }

    return res.json(apiResult).end();
  },
  activate: async(req, res) => {
    const id = req.query.id;
    if (id === '0') {
      return res.status(403).json({message: "User doesn't exist"});
    }
    let apiResult = {};
    if (!id) {
      return res.send('Invalid').redirect('/login');
    }
    let findUser = util.promisify(usermodel.findOneUser);
    let user = await findUser('confirmation', id).then(data => data).catch(error => { return res.status(500).json(
      apiResult.meta = {
        error: error,
        info: user,
      });
    });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (!resultJson[0]) {
      apiResult.meta = {
        error: 'User already activated or wrong link',
      };

      return res.status(500).json(apiResult);
    }
    let activate = util.promisify(usermodel.activate);
    await activate(id).then(data => data).catch(error => {return res.status(500).json(
      apiResult.meta = {
        error: error,
        info: user,
      });
    });
    let updateConfirmation = util.promisify(usermodel.updateConfirmation);
    await updateConfirmation(id).then(data => data).catch(error => {return res.status(500).json(
      apiResult.meta = {
        error: error,
        info: user,
      });
    });

    return res.status(200).json({message: 'User activated'});
  },
  resetPassword: async(req, res) => {
    const id = req.cookies.user_id;
    if (id === '0') {
      return res.status(401).json({message: "User doesn't exist"});
    }
    let apiResult = {};
    if (!id) {
      return res.status(401).json(apiResult)
    }
    const getUser = util.promisify(usermodel.findOneUser);
    const user = await getUser('id', id).then(data => data).catch(err => {res.status(500).json({error: err}); });
    console.log(user);
    res.status(200).send('OK');
  }
};

module.exports = User;
