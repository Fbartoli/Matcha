const express = require('express');
const app = express();
const port = process.env.PORT || 4200;
const user = require('./controllers/user');

app.use(express.urlencoded({extended: true}));
app.get('/', function(req, res) {
  res.send('Welcome to the Matcha API');
});
app.route('/register')
    .get(function(req, res) {
      res.sendFile('index.html', 'root');
    });
app.route('/user')
    .get(user.getAllusers);

app.listen(port, () => {
  console.log('Matcha API server started on: ' + port);
});

