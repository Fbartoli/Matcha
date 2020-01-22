const db = require('../models/dbconnection');
const uniqid = require('uniqid');

module.exports = {
  getAllusers: (req, res) => {
    const pathname = req._parsedUrl.pathname.split('/');
    const section = pathname[1];
    db.query('SELECT * from ??', [section], function(error, results) {
      if (error) {
        let apiResult = {};
        apiResult.meta = {
          table: section,
          type: 'collection',
          total: 0,
        };
        apiResult.data = [];
        res.json(apiResult);
      } else {
        let resultJson = JSON.stringify(results);
        resultJson = JSON.parse(resultJson);
        let apiResult = {};
        apiResult.meta = {
          table: section,
          type: 'collection',
          total: 1,
          total_entries: 0,
        };
        apiResult.data = resultJson;
        res.json(apiResult);
      }
    });
  },
  addUser: (post, res) => {
    db.query('INSERT INTO users (username, name, surmame, email, password) VALUES (?, ?, ?, ?, ?)', post, function(error, result) {
      if (error) {
        let apiResult = {};
        apiResult.meta = {
          table: 'user',
          type: 'add an user',
          error: error,
        };
        apiResult.data = [];
        res.json(apiResult);
      } else {
        let resultJson = JSON.stringify(result);
        resultJson = JSON.parse(resultJson);
        let apiResult = {};
        apiResult.meta = {
          table: 'user',
          type: 'add an user',
          msg: 'sucess',
          id: uniqid(),
        };
        apiResult.data = resultJson;
        res.json(apiResult);
      }
  });
  }
};
