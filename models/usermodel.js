const db = require('../models/dbconnection');
const pathPhotoDefault = "/Users/flbartol/Documents/Matcha/uploads/1024px.png";

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
    db.connection.query('SELECT link FROM photo WHERE user_id = ?', [user_id], function(error, result) {
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
    db.connection.query(`INSERT INTO photo (user_id, link, position) VALUES ('${user_id}', '${pathPhotoDefault}', 1),('${user_id}', '${pathPhotoDefault}', 2),('${user_id}', '${pathPhotoDefault}', 3),('${user_id}', '${pathPhotoDefault}', 4),('${user_id}', '${pathPhotoDefault}', 5) `, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addInterest: (user_id, tag, callback) => {
    db.connection.query(`INSERT INTO interested_in_hobbies (user_id, hobbies_name) VALUES ('${user_id}', ?)`, [tag], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  deleteInterest: (user_id, callback) => {
    db.connection.query(`DELETE from interested_in_hobbies WHERE user_id = '${user_id}'`, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getInterest: (user_id, callback) => {
    db.connection.query(`SELECT hobbies_name FROM interested_in_hobbies WHERE user_id = '${user_id}'`, function(error, result) {
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
  getFullProfile: (info, callback) => {
    db.connection.query('SELECT users.id, users.username, users.location, users.score, users.age, users.gender_id, interested_in_gender.gender_id as `interested_in` FROM users INNER JOIN interested_in_gender ON interested_in_gender.user_id = users.id WHERE `users`.`id`=?', [info], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  // age sexe, interested_in, score, distance
  findFilteredUsers: (info, gender, callback) => {
    let SQL = 'SELECT users.username, ANY_VALUE(users.bio) as bio, ANY_VALUE(users.location) as location,ANY_VALUE(users.id) as id,  ANY_VALUE(interested_in_gender.gender_id) as interested_in, ANY_VALUE(users.gender_id) as gender_id, ANY_VALUE(photo.link) as photos, GROUP_CONCAT(interested_in_hobbies.hobbies_name) as hobbies FROM users INNER JOIN interested_in_hobbies ON interested_in_hobbies.user_id = users.id INNER JOIN interested_in_gender ON interested_in_gender.user_id = users.id INNER JOIN photo ON photo.user_id = users.id ';
    if (gender === '1') {
      let where = 'WHERE (users.age BETWEEN ? AND ? ) AND (users.score BETWEEN ? AND ? ) and photo.position = 1  GROUP BY users.username';
      db.connection.query(`${SQL} ${where}`, info, function(error, result) {
        if (error) {
          return callback(error, null);
        }

        return callback(error, result);
      });
    } else {
      db.connection.query(`${SQL} WHERE (users.age BETWEEN ? AND ? ) AND (users.score BETWEEN ? AND ? ) AND users.gender_id = ${gender}  and photo.position = 1  GROUP BY users.username`, info, function(error, result) {
        if (error) {
          return callback(error, null);
        }

        return callback(error, result);
      });
    }
  },
  findOneUserOther: (field, info, callback) => {
    db.connection.query('SELECT users.id, users.username, users.email, users.name, users.registration_date, users.surname, users.bio, users.birth_date, age, users.gender_id, users.location, users.profile_complete, users.score, users.isOnline, GROUP_CONCAT(photo.link SEPARATOR ";") as photos FROM users INNER JOIN photo ON photo.user_id = users.id WHERE ??=?', [field, info], function(error, result) {
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
    db.connection.query('UPDATE users SET bio = ?, birth_date = ?, gender_id = ?, notification = ?, username = ?, name = ?, surname = ?, email = ?, profile_complete = 1, age = ? WHERE id=?', info, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateFieldUser: (field, value, user_id, callback) => {
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
  addLikeHistory: (user_id, callback) => {
    db.connection.query('INSERT INTO `history_likes` (user_id) VALUES (?)', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addBlockHistory: (user_id, callback) => {
    db.connection.query('INSERT INTO `history_blocks` (user_id) VALUES (?)', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addReportHistory: (user_id, callback) => {
    db.connection.query('INSERT INTO `history_reports` (user_id) VALUES (?)', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addLike: (user_id, history_id, callback) => {
    db.connection.query('INSERT INTO `likes` (user_id, history_likes_id) VALUES (?, ?)', [user_id, history_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  isLiked: (user_id_1, user_id_2, callback) => {
    db.connection.query(`SELECT history_likes.user_id as 'user liked', likes.user_id as 'user who likes' FROM history_likes INNER JOIN likes ON history_likes.id = likes.history_likes_id WHERE history_likes.user_id = '${user_id_2}' AND likes.user_id = '${user_id_1}'`, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getHistoryLikesId: (user_id, callback) => {
    db.connection.query('SELECT * FROM `history_likes` WHERE user_id = ?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getAllLikes: (user_id, callback) => {
    db.connection.query('SELECT history_likes.user_id as `user_liked`, users.username as `user_who_likes`, likes.date as date FROM `history_likes` INNER JOIN `likes` ON history_likes.id = likes.history_likes_id INNER JOIN users ON likes.user_id = users.id WHERE history_likes.user_id = ?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addViewHistory: (user_id, callback) => {
    db.connection.query('INSERT INTO `history_views` (user_id) VALUES (?)', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addView: (user_id, history_id, callback) => {
    db.connection.query('INSERT INTO `views` (user_id, history_views_id) VALUES (?, ?)', [user_id, history_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getHistoryViewsId: (user_id, callback) => {
    db.connection.query('SELECT * FROM `history_views` WHERE user_id = ?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getAllViews: (user_id, callback) => {
    db.connection.query('SELECT history_views.user_id as `user_viewed`, users.username as `user_who_views`, views.date as date FROM `history_views` INNER JOIN views ON history_views.id = views.history_views_id INNER JOIN users ON views.user_id = users.id WHERE history_views.user_id = ?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  isMatch: (user_id_1, user_id_2, callback) => {
    // Check if users like each other
    db.connection.query(`SELECT history_likes.user_id as 'user liked', likes.user_id as 'user who likes' FROM history_likes INNER JOIN likes ON history_likes.id = likes.history_likes_id WHERE history_likes.user_id = '${user_id_1}' AND likes.user_id = '${user_id_2}' OR history_likes.user_id = '${user_id_2}' AND likes.user_id = '${user_id_1}'`, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addMatch: (callback) => {
    db.connection.query('INSERT INTO `match` (`active`) values (1)', function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  lastIdInsert: (callback) => {
    db.connection.query('SELECT last_insert_id() as id;', function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addUsersMatch: (user_id_1, user_id_2, match_id, callback) => {
    db.connection.query(`INSERT INTO match_user (user_id, match_id) values (?, ${match_id}), (?, ${match_id})`, [user_id_1, user_id_2], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getTopProfil: (user_id, user, callback) => {
    let gender1 = 3;
    let gender2 = 3;
    if (user.interested_in === 1) {
      gender1 = 2;
      gender2 = 3;
    } else if (user.interested_in === 2) {
      gender1 = 2;
      gender2 = 2;
    }
    db.connection.query('SELECT users.id, users.username, users.age, users.location, users.gender_id, users.score, interested_in_gender.gender_id as `interested_in` FROM users INNER JOIN interested_in_gender ON interested_in_gender.user_id = users.id WHERE users.id != ? AND (users.gender_id = ? OR users.gender_id = ?) AND (interested_in_gender.gender_id = ? or interested_in_gender.gender_id = 1)', [user_id, gender1, gender2, user.gender_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  importSeed: (post, callback) => {
    db.connection.query('INSERT INTO users (id, username, name, surname, bio, age, birth_date, gender_id, email, password, location, profile_complete, score, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', post, function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  }
};
// ;INSERT INTO `match_user`(`user_id`,`match_id`) values (`?`, LAST_INSERT_ID()),(`?`, LAST_INSERT_ID())
// 'SELECT users.id, users.username, users.age, users.location, users.gender_id, users.score, interested_in_gender.gender_id as `interested_in` FROM users INNER JOIN interested_in_gender ON interested_in_gender.user_id = users.id WHERE users.id != ? AND (users.gender_id = ? OR users.gender_id = ?) '
