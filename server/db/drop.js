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
  const sql = `DROP DATABASE matcha`;
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log('Database dropped');
    con.destroy();
  });
});
