const mysql = require('mysql');

const host = 'localhost';
const user = 'root';
const password = 'password';

const con = mysql.createConnection({
  host: host,
  user: user,
  password: password});

con.connect(function(err) {
  if (err) throw err;
  console.log('Connected!');
  const sql = `CREATE DATABASE IF NOT EXISTS matcha`;
  con.query(sql, function(err) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log('Database created');
    const con = mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: 'matcha'});
    con.connect(function(err) {
      if (err) throw err;
      console.log('Connected!');
      const sql = `CREATE TABLE IF NOT EXISTS user(
        ID INT PRIMARY KEY NOT NULL,
        mobile INT(11),
        username VARCHAR(128) NOT NULL UNIQUE,
        nom VARCHAR(128),
        prenom VARCHAR(128),
        email VARCHAR(255) NOT NULL,
        date_naissance DATE,
        pays VARCHAR(255),
        ville VARCHAR(255),
        code_postal VARCHAR(5),
        sexe VARCHAR(16),
        orientation VARCHAR(32),
        password VARCHAR(128),
        active INT DEFAULT 0
      )`;
      con.query(sql, function(err) {
        if (err) {
          console.log(err);
          con.destroy();
          throw err;
        }
        console.log('Table created');
        con.destroy();
        process.exit();
      });
    });
  });
});

