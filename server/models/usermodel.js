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
  findOneUser: (field, info, callback) => {
    db.query('SELECT * FROM users WHERE ??=?', [field, info], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  activate: (confirmation, callback) => {
    db.query('UPDATE users SET active = ? WHERE confirmation = ?', [1, confirmation], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateUser: (id, info, callback) => {
    db.query('INSERT INTO users (mobile, bio, birth_date, country, city, postal_code, gender_id, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', info, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateConfirmation: (confirmation, callback) => {
    db.query('UPDATE users SET confirmation = ? WHERE confirmation =?', ['0', confirmation], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
};
