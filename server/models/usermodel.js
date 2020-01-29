const db = require('../models/dbconnection');

module.exports = {
  getAllusers: (req, callback) => {
    const pathname = req._parsedUrl.pathname.split('/');
    const section = pathname[1];
    db.query('SELECT * from ??', [section], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addUser: (post, callback) => {
    db.query('INSERT INTO users (username, name, surname, email, password, confirmation) VALUES (?, ?, ?, ?, ?, ?)', post, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findOneUser: (username, callback) => {
    db.query('SELECT * FROM users WHERE username=?', [username], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findOneEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email=?', [email], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findOneConfirmation: (confirmation, callback) => {
    db.query('SELECT username FROM users WHERE confirmation =?', [confirmation], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  activate: (username, callback) => {
    db.query('UPDATE users SET active = 1 WHERE username =?', [username], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  }
};
