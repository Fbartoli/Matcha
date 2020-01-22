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
    db.query('INSERT INTO users (username, name, surname, email, password) VALUES (?, ?, ?, ?, ?)', post, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findOneUser: (username, callback) => {
    db.query('SELECT username, email, password FROM users WHERE username=?', [username], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  }
};
