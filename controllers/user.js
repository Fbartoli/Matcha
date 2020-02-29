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
const getUserOther = util.promisify(usermodel.findOneUserOther);
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
  // getAllusers: async(req, res) => {
  //   const allUsers = await getAllUsers(req).then((data) => data)
  //     .catch((err) => {
  //       res.status(303).json({error: err.error});
  //     });
  //   console.log(allUsers);
  //   let apiResult = {};
  //   let resultJson = JSON.stringify(allUsers);
  //   resultJson = JSON.parse(resultJson);
  //   apiResult.meta = {
  //     table: 'user',
  //     total_entries: 0,
  //   };
  //   apiResult.data = resultJson;
  //   res.json(apiResult);
  // },
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
    let user = await getUser('users.id', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        response(500, 'Internal error', res);
      });
    if (!user[0]) {
      response(400, 'Unknown user', res);
    }
    if (!bcrypt.compareSync(passwordCurrent, user[0].password)) {
      response(400, 'Passwords are not matching', res);
    }
    const hashNew = await hashFct(passwordNew, 2).then((data) => data)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });
    await updateFieldUser(hashNew, 'password', user_id).then((data) => console.log(data))
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });

    return response(200, 'OK', res);
  },
  getUser: async(req, res, payload) => {
    const gender = ['male', 'female'];
    let user_id = payload.user_id;
    const user = await getUser('users.id', user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });
    if (!user[0]) {
      return res.status(500).json({client: 'User not found'});
    }
    const relationship_id = await getRelationship(user_id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });
    const tags = await getTags(user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return res.status(500).json({error: error});
      });
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

    return res.status(200).json({userdata: user[0]});
  },
  getOtherUser: async(req, res, payload) => {
    const gender = ['male', 'female'];
    let username = req.query.username;
    let list = [];
    await getUser('users.id', payload.user_id).then((data) => {
      if (!data[0]) {
        return response(400, 'User not in db', res);
      }
      if (data[0].profile_complete === 0) {
        return response(400, 'Please complete your profile', res);
      }
    })
      .catch((error) => {
        console.log(error);
      });
    let user = await getUserOther('username', username).then(async (data) => {
      if (!data[0]) {
        return res.status(500).json({client: 'User not found'});
      } else {
        data[0].sex = await gender[data[0].gender_id - 1];

        return data;
      }
    })
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });
    await getRelationship(user[0].id).then((data) => {
      user[0].interested_in = data[0].gender_id;
    })
      .catch((err) => {
        console.log(err);

        return res.status(500).json({error: err});
      });
    await getTags(user[0].id).then((data) => {
      if (data[0]) {
        data.forEach((tag) => {
          list.push(tag.hobbies_name);
        });
        user[0].tags = list;
      }
    })
      .catch((error) => {
        console.log(error);

        return res.status(500).json({error: error});
      });
    let photos = await Convertb64(user[0]).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    user[0].photos = photos;

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

    let user = await getUser('users.email', email).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    if (user[0]) {
      return res.status(400).json({client: 'Email already exists'});
    }
    user = await getUser('users.username', username).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    if (user[0]) {
      return res.status(400).json({client: 'Username already exists'});
    }
    const hash = await hashFct(password, 2).then((data) => data)
      .catch((error) => {
        console.log(error);

        return res.status(500).json({client: "Internal error"});
      });
    const post = [username, name, surname, email, hash, confirmation];
    await addUser(post).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    console.log(username);
    user = await getUser('users.username', username).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    console.log(user[0]);
    await addRelationship(user[0].id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    await addViewsHistory(user[0].id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    await addLikeHistory(user[0].id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    await addPhoto(user[0].id).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    mail(email, 'activation link matcha', null, '<p>lien pour activer votre compte : <a href="http://localhost:3000/activate?id=' + confirmation + '"> lien pour activer </a></p>');


    return res.status(200).json({client: 'accepted',
      link: confirmation});
  },
  addUserInfo: async(req, res, payload) => {
    let user_id = payload.user_id;
    let {bio, birth_date, gender_id, notification, interested_in, name, surname, email, username, tags} = req.body;
    if (!(user_id && bio && birth_date && gender_id && notification && interested_in && username && name && surname && email && tags)) {
      return response(400, "Missing information", res);
    }
    await ValidDate(birth_date).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(400, "Wrong date format", res);

      });
    if (!USERNAME_REGEX.test(username) || username.length < 6) {
      return res.status(400).json({client: 'Invalid username, it should contain only letters, numbers and a minimun of 6 characters'});
    }
    if (!NAME_REGEX.test(name) || name.length < 2) {
      return res.status(400).json({client: 'Invalid name, it should contain only letters'});
    }
    if (!NAME_REGEX.test(surname) || surname.length < 2) {
      return res.status(400).json({client: 'Invalid surname, it should contain only letters and it should be longer that 2 characters'});
    }
    let age = await ageCalculator(new Date(birth_date)).then((data) => data)
      .catch((error) => console.log(error));
    let info = [
      sanitize(bio), sanitize(birth_date), sanitize(gender_id), sanitize(notification), sanitize(username),
      sanitize(name), sanitize(surname), sanitize(email), age, sanitize(user_id)
    ];
    if (email) {
      await editEmail(email, user_id).then((data) => data)
        .catch((error) => {
          console.log(error);

          return response(500, error, res);
        });
    }
    await updateUser(info).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    await delTags(user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    let arrayTags = tags.split(',');
    console.log(arrayTags);
    arrayTags.forEach(async (tag) => {
      await addTags(user_id, tag).catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });
    });
    await updateRelationsip(interested_in, user_id).then((data) => data)
      .catch((error) => {
        console.log(error);

        return response(500, 'Internal error', res);
      });

    return response(200, 'Information updated', res);

  },
  checkPassword: async(req, res) => {
    let {username, password} = req.body;
    if (!username || !password) {
      return response(400, 'Missing information', res);
    }
    let user = await getUser('username', username).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: "Internal error"});
      });
    if (!user[0]) {
      return res.status(401).json({
        client: 'Wrong information'
      });
    } else if (user[0].active === 0) {
      return res.status(401).json({
        client: 'Account not activated'
      });
    } else if (bcrypt.compareSync(password, user[0].password)) {
      console.log(user[0].id);
      let user_id = user[0].id;
      const token = jwt.sign({user_id}, jwtkey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
      });

      return res.status(200).json({
        client: 'Login successful !',
        token: token,
        userdata: user[0],
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
      .catch((error) => {
        console.log(error);

        return res.status(500).json({client: "Internal error"});
      });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
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
    let user = await getUserConfirmation(username, confirmation).then((data) => data)
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: 'Internal error'});
      });
    let resultJson = JSON.stringify(user);
    resultJson = JSON.parse(resultJson);
    console.log(resultJson[0]);
    if (resultJson[0].nb !== 1) {
      console.log(resultJson[0]);

      return res.status(401).json({client: 'Contact the website administrator'});
    }
    // redirection versla page pour changer le mot de passe

    return response(200, 'redirect to password change allowed', res);
  },
  PasswordReset: async(req, res) => {
    const password = req.body.password2;
    const username = req.body.username;

    if (!username) {
      return response(500, 'Invalid request, missing username', res);
    }
    if (!PASSWORD_REGEX.test(password) || password.length < 8) {

      return response(500, 'Invalid password, it should contain at least one capital letter, one numerical character and a minimun of 8 characters.', res);
    }
    await getUserReset(username, 1).then((data) => {
      if (data[0].nb !== 1) {
        console.log(data[0]);

        return res.status(401).json({client: 'Contact the website administrator'});
      }
    })
      .catch((err) => {
        console.log(err);

        return res.status(500).json({client: 'Internal error'});
      });
    const hash = await hashFct(password, 2).then((data) => data)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });
    await updatePasswordUsername(username, hash)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });
    const string = uniqid();
    await updateFieldUsername(string, 'confirmation', username)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });
    await updateFieldUsername(0, 'password_reset', username)
      .catch((err) => {
        console.log(err);

        return response(500, 'Internal error', res);
      });

    return response(200, 'Password updated', res);
  },
  // getFilteredUser: async(req, res) => {

  // }
};

module.exports = User;
