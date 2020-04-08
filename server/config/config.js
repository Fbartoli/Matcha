require('dotenv').config();

let CONFIG = {};
// Make this global to use all over the application

CONFIG.app = process.env.APP || 'dev';
CONFIG.port = process.env.PORT || '8080';

CONFIG.db_dialect = process.env.DB_DIALECT || 'mysql';
CONFIG.db_host = process.env.DB_HOST || 'localhost';
CONFIG.db_port = process.env.DB_PORT || '3306';
CONFIG.db_name = process.env.DB_NAME || 'matcha';
CONFIG.db_user = process.env.DB_USER || 'root';
CONFIG.db_password = process.env.DB_PASSWORD || 'password';

CONFIG.jwt_secret = process.env.SECRET_JWT || 'SECRET';
CONFIG.jwt_encryption = process.env.JWT_ENCRYPTION;
CONFIG.jwt_expiration = process.env.JWT_EXPIRATION || 60 * 60 * 24;

CONFIG.email_user = process.env.EMAIL_USER;
CONFIG.email_pass = process.env.EMAIL_PASS;
CONFIG.email_smtp = process.env.EMAIL_SMTP;

module.exports = CONFIG;
