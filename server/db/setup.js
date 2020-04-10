const cp = require("child_process");

cp.exec(
  "docker exec -i 569c8a91111d mysql -uroot -ppassword < matcha.sql",
  (error, stdout, stderr) => {
    if (error) throw error;
    `stdout: ${stdout}`;
    `stderr: ${stderr}`;
  }
);
