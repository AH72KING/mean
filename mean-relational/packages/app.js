'use strict';
var favicon = require('serve-favicon'),
    express = require('express'),
    cors 	= require('cors');
module.exports = function (app) {
    // Set views path, template engine and default layout
    app.set('views', __dirname + '/server/views');

    // Setting the favicon and static folder
    app.use(favicon(__dirname + '/public/assets/img/icons/favicon.ico'));

    // Adding robots and humans txt
    app.use(express.static(__dirname + '/public/assets/static'));

};

   var allowCrossDomain = function(req, res, next) {
        if ('OPTIONS' === req.method) {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
          res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, X-Requested-With');
          res.send(200);
        }
        else {
          next();
        }
    };
    var app = express();
    app.use(cors());
    app.use(allowCrossDomain);
    // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
       // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });
    app.all('/*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      res.header('Access-Control-Allow-Methods', 'GET, POST,PUT');
      next();

    });