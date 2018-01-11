'use strict';
const bodyParser = require("body-parser");
var express     = require('express');
const app = express();
app.use(express.static("public"));
//split upload endpoint out
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

var cluster   = require('cluster');
var env       = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config    = require('./config/config');
var db        = require('./config/sequelize');
var passport  = require('./config/passport');
var winston   = require('./config/winston');
var port = process.env.PORT || config.port;

var allowCrossDomain = function(req, res, next) {
    if ('OPTIONS' === req.method) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

if(env === 'development'){
  return createApp();
}

// Code to run if we're in the master process
if (cluster.isMaster) {

    // Count the machine's CPUs
    var cpuCount = require('os').cpus().length;

    // Create a worker for each CPU
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    // Listen for dying workers
    cluster.on('exit', function (worker) {

        // Replace the dead worker, we're not sentimental
        console.log('Worker ' + worker.id + ' died :(');
        cluster.fork();

    });

    // As workers come up.
    cluster.on('listening', function(worker, address) {
      console.log('A worker with #'+worker.id+' is now connected to ' + address.address + ':' + address.port);
    });

    // Count requestes
    Object.keys(cluster.workers).forEach(function(id) {
      cluster.workers[id].on('message', function(){
        console.log('message');
      });
    });

// Code to run if we're in a worker process
} else {
  createApp();
}

function createApp(){

//Initialize database models
  db.init(function(){
    //Initialize Express
    require('./config/express')(app, passport, db);

    app.listen(port);
    winston.info('Express app started on port ' + port);

  });
}
var io = require('socket.io').listen(app);

// socket.io  //localhost:35729
var socket = io.listen(app);

socket.on('connection', function(client){
  client.on('news', function(msg){
      socket.broadcast(msg);
  })
});