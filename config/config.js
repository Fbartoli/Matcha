require('dotenv').config();

let CONFIG = {};
// Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '3000';

CONFIG.db_dialect = process.env.DB_DIALECT;
CONFIG.db_host = process.env.DB_HOST;
CONFIG.db_port = process.env.DB_PORT;
CONFIG.db_name = process.env.DB_NAME;
CONFIG.db_user = process.env.DB_USER;
CONFIG.db_password = process.env.DB_PASSWORD;

CONFIG.jwt_secret = process.env.SECRET_JWT;
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION;
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION;

CONFIG.email_user = process.env.EMAIL_USER;
CONFIG.email_pass = process.env.EMAIL_PASS;
CONFIG.email_smtp = process.env.EMAIL_SMTP;

module.exports = CONFIG;
