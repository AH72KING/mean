
var MysqlStore = require('express-mysql-session');
var config = require('./config');

var options = {
    host: config.db.host,
    port: config.db.port,
    user: config.db.username,
    password: config.db.password,
    database: config.db.name
};

var sessionStore = new MysqlStore(options);
module.exports = sessionStore;
