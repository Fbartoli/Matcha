const mysql = require('mysql');
const CONFIG = require('../config/config');

const config_db = {
  host: CONFIG.db_host,
  port: CONFIG.db_port,
  user: CONFIG.db_user,
  password: CONFIG.db_password,
  database: CONFIG.db_name,
  insecureAuth: true
};

let pool = mysql.createPool(config_db);

exports.connection = {
  query: function () {
    const queryArgs = Array.prototype.slice.call(arguments),
      events = [],
      eventNameIndex = {};
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log(err);

        return err;
        // if (eventNameIndex.error) {
        //   eventNameIndex.error();
        // }
      }
      if (conn) {
        let query = conn.query.apply(conn, queryArgs);
        query.on('end', function () {
          conn.release();
        });
        events.forEach(function (args) {
          query.on.apply(query, args);
        });
      }
    });

    return {
      on: function (eventName, callback) {
        events.push(Array.prototype.slice.call(arguments));
        eventNameIndex[eventName] = callback;

        return this;
      }
    };
  }
};
