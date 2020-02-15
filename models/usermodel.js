const db = require('../models/dbconnection');

module.exports = {
  getAllusers: (req, callback) => {
    const pathname = req._parsedUrl.pathname.split('/');
    const section = pathname[1];
    db.connection.query('SELECT * from ??', [section], function(error, result) {
      if (error) {

        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getPhoto: (user_id, callback) => {
    db.connection.query('SELECT link, position FROM photo WHERE user_id = ?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addUser: (post, callback) => {
    db.connection.query('INSERT INTO users (username, name, surname, email, password, confirmation) VALUES (?, ?, ?, ?, ?, ?)', post, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addRelationship: (user_id, callback) => {
    db.connection.query('INSERT INTO `interested_in_gender` (user_id, gender_id) VALUES (?, 1)', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addPhoto: (user_id, callback) => {
    db.connection.query(`INSERT INTO photo (user_id, link, position) VALUES ('${user_id}', '/Users/flbartol/Documents/Matcha/uploads/1024px.png', 1),('${user_id}', /Users/flbartol/Documents/Matcha/uploads/1024px.png, 2),('${user_id}', /Users/flbartol/Documents/Matcha/uploads/1024px.png, 3),('${user_id}', /Users/flbartol/Documents/Matcha/uploads/1024px.png, 4),('${user_id}', /Users/flbartol/Documents/Matcha/uploads/1024px.png, 5) `, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updatePhoto: (user_id, link, position, callback) => {
    db.connection.query(`UPDATE photo SET link = ? WHERE user_id = '${user_id}' and position = ?`, [link, position], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findOneUser: (field, info, callback) => {
    db.connection.query('SELECT * FROM users WHERE ??=?', [field, info], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  profileComplete: (user_id, callback) => {
    db.connection.query('SELECT count(*) as nb FROM users WHERE id=? and profile_complete = 1', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findOneUserConfirmation: (username, confirmation, callback) => {
    db.connection.query('SELECT count(*) as nb FROM users WHERE username=? and confirmation=?', [username, confirmation], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findOneUserReset: (username, reset, callback) => {
    db.connection.query('SELECT count(*) as nb FROM users WHERE username=? and password_reset=?', [username, reset], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findCountUser: (field, info, callback) => {
    db.connection.query('SELECT count(*) as nb FROM users WHERE ??=?', [field, info], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  findRelationship: (user_id, callback) => {
    db.connection.query('Select * from `interested_in_gender` WHERE user_id = ?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  activate: (bool, confirmation, callback) => {
    db.connection.query('UPDATE users SET active = ? WHERE confirmation = ?', [bool, confirmation], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateUser: (info, callback) => {
    db.connection.query('UPDATE users SET bio = ?, birth_date = ?, gender_id = ?, location = ?, notification = ?, username = ?, name = ?, surname = ?, email = ?, profile_complete = 1 WHERE id=?', info, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateFieldUser: (value, field, user_id, callback) => {
    db.connection.query('UPDATE users SET ?? = ? WHERE id =?', [field, value, user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateFieldUsername: (value, field, username, callback) => {
    db.connection.query('UPDATE users SET ?? = ? WHERE username =?', [field, value, username], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateConfirmation: (string, confirmation, callback) => {
    db.connection.query('UPDATE users SET confirmation = ? WHERE confirmation =?', [string, confirmation], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updatePassword: (hash, user_id, callback) => {
    db.connection.query('UPDATE users SET password = ? WHERE id =?', [hash, user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateRelationship: (gender, user_id, callback) => {
    db.connection.query('UPDATE `interested_in_gender` SET `gender_id` = ? WHERE user_id =?', [gender, user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updatePasswordUsername: (username, hash, callback) => {
    db.connection.query('UPDATE users SET password=? WHERE username=?', [hash, username], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  deleteUser: (user_id, callback) => {
    db.connection.query('DELETE FROM users WHERE id=?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
};
