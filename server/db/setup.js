const cp = require('child_process');

cp.exec('docker-compose exec -T mysql-development mysql -hlocalhost -uroot -ppassword', (error, stdout, stderr) => {
  if (error) throw error;
  `stdout: ${stdout}`;
  `stderr: ${stderr}`;
});
