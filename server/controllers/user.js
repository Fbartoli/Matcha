// include the model (aka DB connection)
const bcrypt = require('bcrypt');
const uniqid = require('uniqid');
const usermodel = require('../models/usermodel');

const MAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{6,}/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]*$/;
const NAME_REGEX = /^[a-zA-Z_.-]*$/;

// create class
const User = {
  getAllusers: function(req, res) {
    return usermodel.getAllusers(req, res);
  },
  addUser: function(req, res) {
    let {username, name, surname, email, password} = req.body;
    if (!MAIL_REGEX.test(email)) {
      return res.status(400).json({error: 'Invalid mail.'});
    }
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({error: 'Invalid password, it should contain at least one capital letter, one numerical character and a minimun of 6 characters.'});
    }
    if (!USERNAME_REGEX.test(username)) {
      return res.status(400).json({error: 'Invalid username, it should contain only letters and numbers'});
    }
    if (!PASSWORD_REGEX.test(name)) {
      return res.status(400).json({error: 'Invalid name, it should contain only letters'});
    }
    if (!PASSWORD_REGEX.test(surname)) {
      return res.status(400).json({error: 'Invalid surname, it should contain only letters'});
    }
    const post = [username, name, surname, email, password];

    return usermodel.addUser(post, res);
  },
};

module.exports = User;
