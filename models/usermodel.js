const db = require('../models/dbconnection');
const rootDir = require('../constant').rootDIr;
const pathPhotoDefault = `${rootDir}/uploads/1024px.png`;

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
  addNotification: (id, username, msg, callback) => {
    db.connection.query(`INSERT INTO notification (id, username, message) VALUES (? ,'${username}', ?)`, [id, msg], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getNotificationUnread: (username, callback) => {
    db.connection.query(`SELECT * FROM notification WHERE username = ? and 'read' = 0`, [username], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  updateNotification: (notifId, callback) => {
    db.connection.query('UPDATE notification SET `read` = 1 WHERE id = ?', [notifId], function(error, result) {
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
    db.connection.query(`UPDATE photo SET link = ? WHERE user_id = '${user_id}' AND position = ?`, [link, position], function(error, result) {
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
  getUserPassword: (field, info, callback) => {
    db.connection.query('SELECT id, active, password FROM users WHERE ??=?', [field, info], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getFullProfile: (info, callback) => {
    db.connection.query('SELECT users.id, users.username, users.location, users.bio, users.profile_complete, users.last_connection, users.password, users.active, users.score, users.age, users.gender_id, users.last_connection,interested_in_gender.gender_id as `interested_in` FROM users INNER JOIN interested_in_gender ON interested_in_gender.user_id = users.id WHERE `users`.`id`=?', [info], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  // age sexe, interested_in, score, distance
  findFilteredUsers: (info, gender, callback) => {
    let SQL = 'SELECT users.username, ANY_VALUE(users.age) AS age, ANY_VALUE(users.score) as score, ANY_VALUE(users.location) as location, ANY_VALUE(users.id) as id,  ANY_VALUE(interested_in_gender.gender_id) as interested_in, ANY_VALUE(users.gender_id) as gender_id, ANY_VALUE(photo.link) as photos, GROUP_CONCAT(interested_in_hobbies.hobbies_name) as hobbies FROM users INNER JOIN interested_in_hobbies ON interested_in_hobbies.user_id = users.id INNER JOIN interested_in_gender ON interested_in_gender.user_id = users.id INNER JOIN photo ON photo.user_id = users.id ';
    if (gender === '1') {
      let where = 'WHERE (users.age BETWEEN ? AND ? ) AND (users.score BETWEEN ? AND ? ) and photo.position = 1 and users.active = 1 AND users.id <> ? GROUP BY users.username';
      db.connection.query(`${SQL} ${where}`, info, function(error, result) {
        if (error) {
          return callback(error, null);
        }

        return callback(error, result);
      });
    } else {
      db.connection.query(`${SQL} WHERE (users.age BETWEEN ? AND ? ) AND (users.score BETWEEN ? AND ? ) AND users.gender_id = ${gender}  and photo.position = 1 and users.active = 1 AND users.id <> ? GROUP BY users.username`, info, function(error, result) {
        if (error) {
          return callback(error, null);
        }

        return callback(error, result);
      });
    }
  },
  findOneUserOther: (field, info, callback) => {
    db.connection.query('SELECT users.id, users.username, users.email, users.name, users.registration_date, users.surname, users.bio, users.birth_date, age, users.gender_id, users.location, users.profile_complete, users.score, users.isOnline, users.last_connection, GROUP_CONCAT(photo.link SEPARATOR ";") as photos FROM users INNER JOIN photo ON photo.user_id = users.id WHERE ??=?', [field, info], function(error, result) {
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
    db.connection.query('UPDATE users SET bio = ?, birth_date = ?, gender_id = ?, name = ?, surname = ?, profile_complete = 1, age = ? WHERE id=?', info, function(error, result) {
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
  updateFieldUsername: (field, value, username, callback) => {
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
  getAllBlocks: (user_id, callback) => {
    db.connection.query('SELECT history_blocks.user_id as `user_blocked`, users.username as `user_who_blocks`, users.id, blocks.date as date FROM `history_blocks` INNER JOIN `blocks` ON history_blocks.id = blocks.history_blocks_id INNER JOIN users ON blocks.user_id = users.id WHERE blocks.user_id = ?', [user_id], function(error, result) {
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
  addBlock: (user_id, history_id, callback) => {
    db.connection.query('INSERT INTO `blocks` (user_id, history_blocks_id) VALUES (?, ?)', [user_id, history_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getHistoryBlocksId: (user_id, callback) => {
    db.connection.query('SELECT * FROM `history_blocks` WHERE user_id = ?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getAllReports: (user_id, callback) => {
    db.connection.query('SELECT history_reports.user_id as `user_reported`, users.username as `user_who_reports`, users.id, reports.date as date FROM `history_reports` INNER JOIN `reports` ON history_reports.id = reports.history_reports_id INNER JOIN users ON reports.user_id = users.id WHERE reports.user_id = ?', [user_id], function(error, result) {
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
  addReport: (user_id, history_id, callback) => {
    db.connection.query('INSERT INTO `reports` (user_id, history_reports_id) VALUES (?, ?)', [user_id, history_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getHistoryReportsId: (user_id, callback) => {
    db.connection.query('SELECT * FROM `history_reports` WHERE user_id = ?', [user_id], function(error, result) {
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
  deleteLike: (user_id, history_id, callback) => {
    db.connection.query('DELETE FROM `likes` WHERE user_id = ? AND history_likes_id = ?', [user_id, history_id], function(error, result) {
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
  getAllLikesGiven: (user_id, callback) => {
    db.connection.query('SELECT history_likes.user_id as `userid_liked`, users.username as `user_liked`, likes.date as date FROM `history_likes` INNER JOIN `likes` ON history_likes.id = likes.history_likes_id INNER JOIN users ON history_likes.user_id = users.id WHERE likes.user_id = ?', [user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getAllLikesReceived: (user_id, callback) => {
    db.connection.query('SELECT history_likes.user_id as `user_liked`, users.username as `user_who_likes`, users.id, likes.date as date FROM `history_likes` INNER JOIN `likes` ON history_likes.id = likes.history_likes_id INNER JOIN users ON likes.user_id = users.id WHERE history_likes.user_id = ?', [user_id], function(error, result) {
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
  getUserMatched: (user_id, callback) => {
    db.connection.query('select username, users.id from users INNER JOIN match_user on match_user.user_id = users.id where match_user.match_id IN (select match_id from match_user where match_user.user_id = ?) and users.id <> ? group by users.username, users.id;', [user_id, user_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getMatchIdUsers: (username1, username2, callback) => {
    db.connection.query('select match.id, users.username from `match` INNER JOIN match_user on match_user.match_id = match.id INNER JOIN users ON users.id = match_user.user_id WHERE users.username = ? or users.username = ?', [username1, username2], function(error, result) {
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
  addMatch: (id, callback) => {
    db.connection.query('INSERT INTO `match` (`id`,`active`) values (?,1)', [id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  deleteMatch: (id, callback) => {
    db.connection.query('delete from `match` where id = ?', [id], function(error, result) {
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
    db.connection.query(`INSERT INTO match_user (user_id, match_id) values (?, '${match_id}'), (?, '${match_id}')`, [user_id_1, user_id_2], function(error, result) {
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
  },
  addConversation: (id, callback) => {
    db.connection.query('INSERT INTO `conversation` (`id`) values (?)', [id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getConversationId: (user1, user2, callback) => {
    db.connection.query('select conversation_id from participants inner join users ON users.id = participants.user_id where user_id = ? and conversation_id IN (select conversation_id from participants where user_id = ?)', [user1, user2], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addParticipants: (user1, user2, id, callback) => {
    db.connection.query('INSERT INTO participants (`conversation_id`, `user_id`) values (?,?),(?,?)', [id, user1, id, user2], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  addMessages: (user_id, msg, conversation_id, callback) => {
    db.connection.query('INSERT INTO messages (`user_id`,`message_text`, `conversation_id`) values (?,?,?)', [user_id, msg, conversation_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getUserId: (username, callback) => {
    db.connection.query('SELECT * FROM users WHERE USERNAME = ?', [username], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
  getMessages: (conversation_id, callback) => {
    db.connection.query('SELECT messages.*, users.username FROM messages INNER JOIN users ON users.id = messages.user_id WHERE conversation_id = ?', [conversation_id], function(error, result) {
      if (error) {
        return callback(error, null);
      }

      return callback(error, result);
    });
  },
};
