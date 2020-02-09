// include the model (aka DB connection)
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const CONFIG = require('../config/config');
const usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const mail = require('../utils/mail');
const sanitize = require('sanitize-html');
const util = require('util');

const getUser = util.promisify(usermodel.findOneUser);
const getAllUsers = util.promisify(usermodel.getAllusers);
const hashFct = util.promisify(bcrypt.hash);
const addUser = util.promisify(usermodel.addUser);
// const updateUser = util.promisify(usermodel.updateUser);
const activate = util.promisify(usermodel.activate);
const updateConfirmation = util.promisify(usermodel.updateConfirmation);
const updateFieldUser = util.promisify(usermodel.updateFieldUser);
const updateFieldUsername = util.promisify(usermodel.updateFieldUsername);
const getUserCriteri = util.promisify(usermodel.findOneUserCriteri);
const updatePasswordUsername = util.promisify(usermodel.updatePasswordUsername);

const MAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]*$/;
const NAME_REGEX = /^[a-zA-Z_.-]*$/;
const GENDER_REGEX = /^[1-3]*1/;

const jwtkey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

// wrapper response
function response (status, message, res) {
  return res.status(status).json({client: message});
}

const User = {
  getAllusers: async(req, res) => {
    const allUsers = await getAllUsers(req).then((data) => data)
      .catch((err) => {
        res.status(303).json({error: err.error});
      });
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
    const user = await getUser('id', req.header('user_id')).then((data) => data)
      .catch((err) => {
        res.status(303).json({error: err.error});
      });
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
    console.log(req.body);
    const confirmation = uniqid();
    if (!(username || name || surname || email || password)) {

      return res.status(400).json({client: "Missing informations, fill the form"});
    }
    if (!MAIL_REGEX.test(email)) {
      return res.status(400).json({client: 'Invalid mail.'});
    }
    if (!PASSWORD_REGEX.test(password) || password.length < 8) {
      return res.status(400).json({client: 'Invalid password, it should contain at least one capital letter, one numerical character and a minimun of 8 characters.'});
    }
    if (!USERNAME_REGEX.test(username) || username.length < 6) {
      return res.status(400).json({client: 'Invalid username, it should contain only letters, numbers and a minimun of 6 characters'});
    }
    if (!NAME_REGEX.test(name) || name.length < 2) {
      return res.status(400).json({client: 'Invalid name, it should contain only letters'});
    }
    if (!NAME_REGEX.test(surname) || surname.length < 2) {
      return res.status(400).json({client: 'Invalid surname, it should contain only letters and it should be longer that 2 characters'});
    }
    let user = await getUser('email', email).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (resultJson[0]) {

      return res.status(400).json({client: 'Email already exists'});
    }
    user = await getUser('username', username).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (resultJson[0]) {

      return res.status(400).json({client: 'Username already exists'});
    }
    const hash = await hashFct(password, 2).then((data) => data)
      .catch((error) => {
        throw new Error(error);
      });
    const post = [username, name, surname, email, hash, confirmation];
    await addUser(post).then((data) => data)
      .catch((error) => res.status(500).json({error: error}));
    mail(email, 'activation link matcha', null, '<p>lien pour activer votre compte : <a href="http://localhost:3000/activate?id=' + confirmation + '"> lien pour activer </a></p>');

    return res.status(200).json({client: 'accepted'});
  },
  editEmail: async(req, res) => {
    const email = req.body.email;
    const user_id = req.body.user_id;
    if (!(email || user_id)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    if (!MAIL_REGEX.test(email)) {
      return res.status(400).json({error: 'Invalid mail.'});
    }
    await updateFieldUser(email, 'email', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });

    return res.status(200);
  },
  editBio: async(req, res) => {
    const bio = sanitize(req.body.bio);
    const user_id = req.body.user_id;
    if (!(bio || user_id)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }

    await updateFieldUser(bio, 'bio', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });

    return res.status(200);
  },
  editGender: async(req, res) => {
    const gender_id = req.body.gender_id;
    const user_id = req.body.user_id;
    if (!(gender_id || user_id)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    if (!GENDER_REGEX.test(gender_id)) {
      return res.status(400).json({error: 'Invalid input.'});
    }
    await updateFieldUser(gender_id, 'gender_id', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });

    return res.status(200);
  },
  // addUserInfo: async(req, res) => {
  //   let {bio, birth_date, gender_id, location, int_in_gender, int_in_rela} = req.body;
  //   bio = sanitize(bio);
  //   bio = sanitize(location);

  // },
  checkPassword: async(req, res) => {
    let {username, password} = req.body;
    let user = await getUser('username', username).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (!resultJson[0]) {
      return res.status(401).json({
        client: 'Wrong information'
      });
    } else if (resultJson[0].active === 0) {
      return res.status(401).json({
        client: 'Account not activated'
      });
    } else if (bcrypt.compareSync(password, resultJson[0].password)) {
      const token = jwt.sign({username}, jwtkey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
      });

      return res.status(200).json({
        client: 'Login successful !',
        token: token,
        userdata: {
          user_id: resultJson[0].id,
          username: username
        }
      });
    } else {
      return res.status(401).json({
        client: 'Wrong information'
      });
    }
  },
  activate: async(req, res) => {
    const confirmation = req.query.id;
    if (confirmation === '0') {
      return res.status(403).json({client: "Wrong information"});
    }
    if (!confirmation) {
      return res.status(400).json({client: "Missing information"});
    }
    let user = await getUser('confirmation', confirmation).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (!resultJson[0]) {

      return res.status(500).json({
        client: 'User already activated or wrong link',
      });
    }
    await activate('1', confirmation).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    const string = uniqid();
    await updateConfirmation(string, confirmation).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });

    return res.status(200).json({client: 'User activated'});
  },
  resetPasswordEmail: async(req, res) => {
    const email = req.body.email;
    if (!email) {
      return res.status(401).json({client: "Email not provided"});
    }
    console.log(email);
    const user = await getUser('email', email).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    console.log(resultJson[0]);
    if (resultJson[0]) {
      await updateFieldUser(1, 'password_reset', resultJson[0].id).then((data) => console.log(data))
        .catch((err) => {
          console.log(err);

          return response(500, 'Internal error', res);
        });
      // proteger contre les whitespaces;
      mail(email, 'reset link matcha', null, '<p>lien pour changer votre mot de passe : <a href="http://localhost:3000/password?id=' + resultJson[0].confirmation + '&username=' + resultJson[0].username + '"> lien reset </a></p>');

      return response(200, 'OK', res);
    }

    return response(401, 'User not found', res);
  },
  isPasswordReset: async(req, res) => {
    const confirmation = req.query.id;
    const username = req.query.username;
    console.log(req.query);
    if (!(confirmation || username)) {

      return res.status(500).json({client: 'Internal error'});
    }
    let user = await getUserCriteri(username, confirmation).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: 'Internal error'});
      });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    console.log(resultJson[0]);
    if (resultJson[0].nb !== 1) {
      console.log(resultJson[0]);

      return res.status(401).json({client: 'The contact the website administrator'});
    }
    // redirection versla page pour changer le mot de passe

    return response(200, 'redirect to password change allowed', res);
  },
  PasswordReset: async(req, res) => {
    const password = req.body.password1;
    const passwordBis = req.body.password2;
    const username = req.body.username;

    if (!username) {

      return response(500, 'Invalid request, missing username', res);
    }
    if (password !== passwordBis) {

      return response(500, 'Password does not match', res);
    }
    if (!PASSWORD_REGEX.test(password) || password.length < 8) {

      return response(500, 'Invalid password, it should contain at least one capital letter, one numerical character and a minimun of 8 characters.', res);
    }
    const hash = await hashFct(password, 2).then((data) => data)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });
    await updatePasswordUsername(username, hash).then((data) => data)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });
    const string = uniqid();
    await updateFieldUsername(string, 'confirmation', username).then((data) => data)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });

    return response(200, 'Password updated', res);
  }
};

module.exports = User;
