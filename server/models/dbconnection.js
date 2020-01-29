const mysql = require('mysql');
const CONFIG = require('../config/config');

const connection = mysql.createConnection({
  host: CONFIG.db_host,
  port: CONFIG.db_port,
  user: CONFIG.db_user,
  password: CONFIG.db_password,
  database: CONFIG.db_name,
});
connection.connect(function(res, err) {
  if (err) {
    res.send(err);
  }
  console.log('Connected!');
});
module.exports = connection;
