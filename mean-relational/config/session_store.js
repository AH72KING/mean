
var MysqlStore = require('express-mysql-session');
var config = require('./config');

var options = {
    //host: config.db.host?config.db.host:'192.168.100.88',
    host: config.db.host?config.db.host:'192.168.1.88',
    port: config.db.port?config.db.port:3306,
    user: config.db.username,
    password: config.db.password,
    database: config.db.name
};

var sessionStore = new MysqlStore(options);
module.exports = sessionStore;
