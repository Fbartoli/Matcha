const express = require('express');
const CONFIG = require('./config/config');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const socketIOHelper = require('./middleware/socket');
const morgan = require('morgan');
const socketIO = require('socket.io');
let receivers = require('./controllers/socket');

const port = CONFIG.port;

const app = express();
const router = require('./routes/router');

// log setup
morgan.token('host', function(req) {
  return req.hostname;
});

morgan.token('header-auth', function(req) {
  return req.header('authorization');
});

// middlewares
app.use(morgan(':host :method :url :header-auth :status :res[content-length] - :response-time ms'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}));
app.use(express.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(CONFIG.jwt_secret));
app.use(router);
// start server
let server = app.listen(port, () => {
  console.log('Matcha API server started on: ' + port);
});

let io = socketIO(server);
socketIOHelper.set(io);
receivers.receivers(io);
