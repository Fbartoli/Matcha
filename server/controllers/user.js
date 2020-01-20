// include the model (aka DB connection)
const db = require('../models/dbconnection');

// create class
const User = {
  getAllusers: function(req, res) {
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
      }
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
    });
  },
  addUser: function(req, res) {
    const post = [req.body.username, req.body.username, req.body.prenom, req.body.email, req.body.password];
    db.query('INSERT INTO user (username, nom, prenom, email, password) VALUES (?, ?, ?, ?, ?)', post, function(error, result) {
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
          };
          apiResult.data = resultJson;
          res.json(apiResult);
        }
    });
  }
};
module.exports = User;
