// include the model (aka DB connection)
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const CONFIG = require('../config/config');
const usermodel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const mail = require('../utils/mail');
const sanitize = require('sanitize-html');
const util = require('util');
const handlers = require('../middleware/handlers');
const edit = require('./edit');

const getUser = util.promisify(usermodel.findOneUser);
const getUserPass = util.promisify(usermodel.getUserPassword);
const getUserOther = util.promisify(usermodel.findOneUserOther);
const getFulluser = util.promisify(usermodel.getFullProfile);
// const getAllUsers = util.promisify(usermodel.getAllusers);
const getUserConfirmation = util.promisify(usermodel.findOneUserConfirmation);
const getUserReset = util.promisify(usermodel.findOneUserReset);
const getRelationship = util.promisify(usermodel.findRelationship);
const getTags = util.promisify(usermodel.getInterest);
const hashFct = util.promisify(bcrypt.hash);

const addPhoto = util.promisify(usermodel.addPhoto);
const addUser = util.promisify(usermodel.addUser);
const addRelationship = util.promisify(usermodel.addRelationship);
const addLikeHistory = util.promisify(usermodel.addLikeHistory);
const addViewsHistory = util.promisify(usermodel.addViewHistory);
const addBlocksHistory = util.promisify(usermodel.addBlockHistory);
const getBlock = util.promisify(usermodel.getAllBlocks);
const addReportsHistory = util.promisify(usermodel.addReportHistory);
const activate = util.promisify(usermodel.activate);
const addTags = util.promisify(usermodel.addInterest);
const delTags = util.promisify(usermodel.deleteInterest);

const editEmail = util.promisify(edit.checkEmail);

const updateUser = util.promisify(usermodel.updateUser);
const updateConfirmation = util.promisify(usermodel.updateConfirmation);
const updateFieldUser = util.promisify(usermodel.updateFieldUser);
const updateRelationsip = util.promisify(usermodel.updateRelationship);
const updateFieldUsername = util.promisify(usermodel.updateFieldUsername);
const updatePasswordUsername = util.promisify(usermodel.updatePasswordUsername);

const MAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]*$/;
const NAME_REGEX = /^[a-zA-Z_.-]*$/;

const jwtkey = CONFIG.jwt_secret;
const jwtExpirySeconds = CONFIG.jwt_expiration;

// wrapper response
function response (status, message, res) {
  return res.status(status).json({client: message});
}
const ValidDate = util.promisify(handlers.isValidDate);
const ageCalculator = util.promisify(handlers.calculateAge);
const Convertb64 = util.promisify(handlers.Convertb64);
const User = {
  editPassword: async(req, res, payload) => {
    const passwordNew = req.body.password2;
    const passwordCurrent = req.body.password;
    const user_id = payload.user_id;
    if (!(passwordNew && user_id && passwordCurrent)) {
      return res.status(400).json({error: "Missing informations, fill the form"});
    }
    if (passwordNew === passwordCurrent) {
      return res.status(400).json({error: "Input different password"});
    }
    if (!PASSWORD_REGEX.test(passwordNew)) {
      return res.status(400).json({error: 'Invalid input.'});
    }
    try {
      let user = await getUser('users.id', user_id).then((data) => data);
      if (!user[0]) {
        return response(400, 'Unknown user', res);
      }
      if (!bcrypt.compareSync(passwordCurrent, user[0].password)) {
        return response(400, 'Passwords are not matching', res);
      }
      const hashNew = await hashFct(passwordNew, 2).then((data) => data);

      await updateFieldUser('password', hashNew, user_id).then((data) => console.log(data));

    } catch (error) {
      console.log(error);

      return res.status(500).json({error: error});
    }

    return response(200, 'OK', res);
  },
  getUser: async(req, res, payload) => {
    const gender = ['male', 'female'];
    let user_id = payload.user_id;
    let user = {};
    try {
      user = await getUser('users.id', user_id).then((data) => data);
      if (!user[0]) {
        return res.status(400).json({client: 'User not found'});
      }
      const relationship_id = await getRelationship(user_id).then((data) => data);
      const tags = await getTags(user_id).then((data) => data);
      let list = [];
      tags.forEach((tag) => {
        list.push(tag.hobbies_name);
      });
      console.log(list);
      user[0].tags = list;
      // refacto coté sql parce que c'est pas beau
      Reflect.deleteProperty(user[0], 'password');
      Reflect.deleteProperty(user[0], 'password_reset');
      Reflect.deleteProperty(user[0], 'registration_date');
      Reflect.deleteProperty(user[0], 'active');
      Reflect.deleteProperty(user[0], 'confirmation');
      Reflect.deleteProperty(user[0], 'isOnline');
      user[0].interested_in = relationship_id[0].gender_id;
      user[0].sex = gender[user[0].gender_id - 1];
    } catch (error) {
      return response(500, 'Internal Error', res);
    }

    return res.status(200).json({userdata: user[0]});
  },
  getOtherUser: async(req, res, payload) => {
    const gender = ['male', 'female'];
    let username = req.query.username;
    let list = [];
    let user = {};
    try {
      let check = await getUser('users.id', payload.user_id).then((data) => data);
      if (!check[0].id) return response(400, 'User not in db 170 ', res);
      if (check[0].profile_complete === 0) return response(400, 'Please complete your profile', res);
      let blocks = await getBlock(payload.user_id).then((data) => data);
      user = await getUserOther('username', username).then((data) => data);
      if (!user[0].id) return response(400, 'User not in db 170 ', res);
      if (user[0].profile_complete === 0) return response(400, 'Please complete your profile', res);
      user[0].sex = await gender[user[0].gender_id - 1];
      for (let ind = 0; ind < blocks.length; ind += 1) {
        let blocked_id = blocks[ind].user_blocked;
        if (user[0].id === blocked_id) return response(400, 'You Blocked that user', res);
      }
      await getRelationship(user[0].id).then((data) => {
        user[0].interested_in = data[0].gender_id;
      });
      await getTags(user[0].id).then((data) => {
        if (data[0]) {
          data.forEach((tag) => {
            list.push(tag.hobbies_name);
          });
          user[0].tags = list;
        }
      });
      let photos = await Convertb64(user[0]).then((data) => data);
      user[0].photos = photos;
    } catch (error) {
      return response(500, 'Internal error', res);
    }

    return res.status(200).json({userdata: user[0]});
  },
  addUser: async(req, res) => {
    let {username, name, surname, email, password} = req.body;
    const confirmation = uniqid();
    if (!(username && name && surname && email && password)) {
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
    try {
      let user = await getUser('users.email', email).then((data) => data);
      if (user[0]) return res.status(400).json({client: 'Email already exists'});
      user = await getUser('users.username', username).then((data) => data);
      if (user[0]) return res.status(400).json({client: 'Username already exists'});
      const hash = await hashFct(password, 2).then((data) => data);
      const post = [username, name, surname, email, hash, confirmation];
      await addUser(post).then((data) => data);
      user = await getUser('users.username', username).then((data) => data);
      await addRelationship(user[0].id).then((data) => data);
      await addViewsHistory(user[0].id).then((data) => data);
      await addLikeHistory(user[0].id).then((data) => data);
      await addBlocksHistory(user[0].id).then((data) => data);
      await addReportsHistory(user[0].id).then((data) => data);
      await addPhoto(user[0].id).then((data) => data);
      mail(email, 'activation link matcha', null, '<p>lien pour activer votre compte : <a href="http://localhost:3000/activate?id=' + confirmation + '"> lien pour activer </a></p>');
    } catch (error) {
      return res.status(500).json({client: "Internal error"});
    }

    return res.status(200).json({client: 'accepted',
      link: confirmation});
  },
  addUserInfo: async(req, res, payload) => {
    let user_id = payload.user_id;
    console.log(payload);
    let {bio, birth_date, gender_id, notification, interested_in, name, surname, email, tags} = req.body;
    if (!(user_id && bio && birth_date && gender_id && notification && interested_in && name && surname && email && tags)) {
      return response(400, "Missing information", res);
    }
    if (gender_id < 1 || gender_id > 3) {
      return response(400, 'Wrong gender ID', res);
    }
    if (interested_in < 1 || interested_in > 3) {
      return response(400, 'Wrong Interested_in ID', res);
    }
    try {
      await ValidDate(birth_date);
    } catch (error) {
      console.log(error);

      return response(400, 'Wrong input', res);
    }
    if (!NAME_REGEX.test(name) || name.length < 2) {
      return res.status(400).json({client: 'Invalid name, it should contain only letters'});
    }
    if (!NAME_REGEX.test(surname) || surname.length < 2) {
      return res.status(400).json({client: 'Invalid surname, it should contain only letters and it should be longer that 2 characters'});
    }
    let age = await ageCalculator(new Date(birth_date)).then((data) => data);
    let info = [
      sanitize(bio), sanitize(birth_date), sanitize(gender_id), sanitize(notification),
      sanitize(name), sanitize(surname), age, sanitize(user_id)
    ];
    try {
      await editEmail(email, user_id);
      await updateUser(info);
      await delTags(user_id);
      let arrayTags = tags.split(',');
      arrayTags.forEach(async (tag) => {
        await addTags(user_id, tag);
      });
      await updateRelationsip(interested_in, user_id).then((data) => data);
    } catch (error) {
      console.log(error);

      return response(500, 'Internal Error', res);
    }

    return response(200, 'Information updated', res);

  },
  checkPassword: async(req, res) => {
    let {username, password} = req.body;
    if (!username || !password) {
      return response(400, 'Missing information', res);
    }
    try {
      let user = await getUserPass('username', username).then((data) => data);
      if (!user[0]) {
        return res.status(401).json({
          client: 'Wrong information'
        });
      } else if (user[0].active === 0) {
        return res.status(401).json({
          client: 'Account not activated'
        });
      } else if (bcrypt.compareSync(password, user[0].password)) {
        let user_id = user[0].id;
        const token = jwt.sign({user_id: user_id,
          username: username}, jwtkey, {
          algorithm: 'HS256',
          expiresIn: jwtExpirySeconds
        });
        await updateFieldUser('last_connection', new Date(Date.now()), user[0].id);
        let result = await getFulluser(user[0].id).then((data) => data[0]);
        Reflect.deleteProperty(result, 'password');

        return res.status(200).json({
          client: 'Login successful !',
          token: token,
          userdata: result,
        });
      } else {
        return res.status(401).json({
          client: 'Wrong information'
        });

      }
    } catch (error) {
      return res.status(500).json({client: "Internal error"});
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
    try {
      let user = await getUser('confirmation', confirmation).then((data) => data);
      let resultJson = JSON.stringify(user);
      resultJson = JSON.parse(resultJson);
      if (!resultJson[0]) {

        return res.status(500).json({
          client: 'User already activated or wrong link',
        });
      }
      await activate('1', confirmation).then((data) => data);
      const string = uniqid();
      await updateConfirmation(string, confirmation).then((data) => data);
    } catch (error) {
      return res.status(500).json({client: "Internal error"});
    }

    return res.status(200).json({client: 'User activated'});
  },
  resetPasswordEmail: async(req, res) => {
    const email = req.body.email;
    if (!email) {
      return res.status(401).json({client: "Email not provided"});
    }
    const user = await getUser('email', email).then((data) => data)
      .catch((error) => {
        console.log(error);

        return res.status(500).json({client: "Internal error"});
      });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (resultJson[0]) {
      await updateFieldUser('password_reset', 1, resultJson[0].id).then((data) => console.log(data))
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
    let user = {};
    if (!confirmation || !username) {
      return response(400, 'missing parameters', res);
    }
    try {
      user = await getUserConfirmation(username, confirmation).then((data) => data);
    } catch (error) {
      return response(500, 'Internal error', res);
    }
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    if (resultJson[0].nb !== 1) {
      console.log(resultJson[0]);

      return res.status(401).json({client: 'Contact the website administrator'});
    }
    // redirection vers la page pour changer le mot de passe

    return response(200, 'redirect to password change allowed', res);
  },
  PasswordReset: async(req, res) => {
    if (!req.body.password2 || !req.body.username) {
      return response(400, 'Missing parameters', res);
    }
    const password = req.body.password2;
    const username = req.body.username;

    if (!username) return response(500, 'Invalid request, missing username', res);
    if (!PASSWORD_REGEX.test(password) || password.length < 8) {
      return response(500, 'Invalid password, it should contain at least one capital letter, one numerical character and a minimun of 8 characters.', res);
    }
    try {
      let data = await getUserReset(username, 1).then((data) => data[0].nb !== 1);
      if (data) return res.status(401).json({client: 'Contact the website administrator'});
      const hash = await hashFct(password, 2).then((data) => data);
      await updatePasswordUsername(username, hash);
      const string = uniqid();
      await updateFieldUsername('confirmation', string, username);
      await updateFieldUsername('password_reset', 0, username);
    } catch (error) {
      return response(500, 'Internal error', res);
    }

    return response(200, 'Password updated', res);
  },
};

module.exports = User;
