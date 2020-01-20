var mysql = require('mysql');

const host = 'localhost';
const user = 'root';
const password = 'password';

var con = mysql.createConnection({
    host: host,
    user: user,
    password: password
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = `CREATE DATABASE IF NOT EXISTS matcha`
    con.query(sql, function (err, result) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log("Database created");
      var con = mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: "matcha"
      });
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `CREATE TABLE IF NOT EXISTS user(
          ID INT PRIMARY KEY NOT NULL,
          mobile INT(11) NOT NULL,
          username VARCHAR(128) NOT NULL UNIQUE,
          nom VARCHAR(128) NOT NULL,
          prenom VARCHAR(128) NOT NULL,
          email VARCHAR(255) NOT NULL,
          date_naissance DATE NOT NULL,
          pays VARCHAR(255) NOT NULL,
          ville VARCHAR(255) NOT NULL,
          code_postal VARCHAR(5) NOT NULL,
          sexe VARCHAR(16) NOT NULL,
          orientation VARCHAR(32) NOT NULL,
          password VARCHAR(128) NOT NULL,
          active INT NOT NULL DEFAULT 0
        )`
        con.query(sql, function (err, result) {
          if (err) {
            console.log(err);
            con.destroy();
            throw err;
          }
          console.log("Table created");
          con.destroy();
          process.exit();
        });
      });
    });
});

