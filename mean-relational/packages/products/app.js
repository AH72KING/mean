'use strict';
var express = require('express');
var cors = require('cors');
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
    /*app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
]);*/
module.exports = function(){

};
