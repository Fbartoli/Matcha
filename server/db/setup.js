const cp = require("child_process");

cp.exec(
  "docker exec -i $(docker ps -q --filter name=mysql) mysql -uroot -ppassword < Matcha.sql",
  (error, stdout, stderr) => {
    if (error) throw error;
    `stdout: ${stdout}`;
    `stderr: ${stderr}`;
  }
);
