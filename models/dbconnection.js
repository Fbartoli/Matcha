const mysql = require('mysql');
const CONFIG = require('../config/config');

const db_config = {
  host: CONFIG.db_host,
  port: CONFIG.db_port,
  user: CONFIG.db_user,
  password: CONFIG.db_password,
  database: CONFIG.db_name
};

const connection = mysql.createConnection(db_config);
connection.connect(function(res, err) {
  if (err) {
    console.log(err);
  }
  console.log('Connected!');
});

function handleDisconnect() {
  let connection = mysql.createConnection(db_config);
  connection.connect(function(err) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });
  connection.on('error', function(err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

module.exports = {connection,
  handleDisconnect};
