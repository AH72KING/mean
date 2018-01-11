'use strict';
var passport    = require('passport');
var bcrypt      = require('bcrypt');
// These are different types of authentication strategies that can be used with Passport.
var LocalStrategy       = require('passport-local').Strategy;
var TwitterStrategy     = require('passport-twitter').Strategy;
var FacebookStrategy    = require('passport-facebook').Strategy;
var TumblrStrategy      = require('passport-tumblr').Strategy;
//var GoogleStrategy    = require('passport-google').Strategy;
var GoogleStrategy      = require('passport-google-oauth').OAuth2Strategy;

var config  = require('./config');
var db      = require('./sequelize');
var winston = require('./winston');

var SocialPassword = 'social';

var express = require('express');
var http    = require('http');

var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

var app = express();

const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var ip = config.db.host;
var ApiBasePath = '/Anerve/anerveWs/AnerveService/';
var headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type' : 'application/json; charset=UTF-8',
    'Access-Control-Allow-Headers': 'content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT',
    'Access-Control-Max-Age': '3600',
    'Access-Control-Allow-Credentials': 'true'
};

function encryptPassword(PASSWORD){
    var salt = bcrypt.genSaltSync(10);
        if (!PASSWORD || !salt){
            return '';
        }
 return bcrypt.hashSync(PASSWORD, salt);
}
var socialPass = encryptPassword(SocialPassword);

//Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.USERID);
});

passport.deserializeUser(function(USERID, done) {
    db.User.find({where: {USERID: USERID}})
    .then(function(user){

        if(!user){return done('error');}

        winston.info('Session: { USERID: ' + user.USERID + ', USERNAME: ' + user.USERNAME + ' }');
        done(null, user);

    }).catch(function(err){
        done(err, null);
    });
});

//Use local strategy
passport.use(new LocalStrategy({
    usernameField: 'USERNAME',
    passwordField: 'PASSWORD'
  },
  function(USERNAME, PASSWORD, done) {
    db.User.find({ where: { USERNAME: USERNAME }}).then(function(user) {
      if(!user) {
        done(null, false, { message: 'Unknown user' });
      } else if (!user.authenticate(PASSWORD)) {
        done(null, false, { message: 'Invalid PASSWORD'});
      } else {
        db.Login.update({online:1},{where:{userId:user.USERID}}); 
        db.User.update({online:1},{where:{USERID:user.USERID}}); 
        winston.info('Login (local) : { USERID: ' + user.USERID + ', USERNAME: ' + user.USERNAME + ' }');
        done(null, user);
      }
    }).catch(function(err){
      done(err);
    });
  }
));

passport.use(new TumblrStrategy({
    consumerKey: config.tumblr.clientID,
    consumerSecret: config.tumblr.clientSecret,
    callbackURL: config.tumblr.callbackURL
  },
  function(token, tokenSecret, profile, done) {
    if(token != 'undefined' && token != undefined){
        localStorage.setItem('tb_token', token);
    }
    if(tokenSecret != 'undefined' && tokenSecret != undefined){
        localStorage.setItem('tb_secret', tokenSecret);
    }
    var current_user_id = localStorage.getItem('current_user_id');
    console.log('current_user_id');
    console.log(current_user_id);
    if(current_user_id != '' && current_user_id != undefined && current_user_id != 'undefined'){
        db.User.find({where: {USERID: current_user_id}}).then(function(user){
            if(!user){ 
                    // we cannot create user from Tumblr now as it does not proivde email
            } else { 
                var updateConnect = "";
                if(user.connections != '' && user.connections != null){
                    updateConnect = {'connections':JSON.parse(user.connections)};
                    updateConnect.connections['tumblr'] = 1;
                } else {
                    updateConnect = {'connections':{'tumblr':1}};
                }
                updateConnect.connections = JSON.stringify(updateConnect.connections);
                db.User.update({
                    tb_token: token,
                    tb_secret: tokenSecret,
                    connections : updateConnect.connections
                }, {
                  where: {USERID: current_user_id}
                });

                winston.info('New User (twitter) : { id: ' + user.USERID + ', username: ' + user.USERNAME + ' }');
                done(null, user);
            }
           
        }).catch(function(err){
            done(err, null);
        });
    }else{
        done('Fail Due to Missing User ID', null);
    }
  }
));


//    Use twitter strategy
passport.use(new TwitterStrategy({
        consumerKey: config.twitter.clientID,
        consumerSecret: config.twitter.clientSecret,
        callbackURL: config.twitter.callbackURL,
       // userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        profileFields: ['id' ,'email', 'displayName', 'include_email=true'],
        email: true,
       // userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        includeEmail:true,
    },
    function(token, tokenSecret, profile, done) {
        if(token != 'undefined' && token != undefined){
            localStorage.setItem('tw_token', token);
        }
        if(tokenSecret != 'undefined' && tokenSecret != undefined){
            localStorage.setItem('tw_secret', tokenSecret);
        }
        var current_user_id = localStorage.getItem('current_user_id');
        console.log('current_user_id');
        console.log(current_user_id);

        var Twitter = require('twitter');
        var client = new Twitter({
              consumer_key: config.twitter.clientID,
              consumer_secret: config.twitter.clientSecret,
              access_token_key: localStorage.getItem('tw_token'),
              access_token_secret: localStorage.getItem('tw_secret')
            });
        var email = '';
        var params = {include_email:true};
        client.get('account/verify_credentials', params, function(error, tweets, response) {
            email = JSON.parse(response.body).email;
            var provider  = 'twitter';
            var whereObject = {};
            if(current_user_id != undefined && current_user_id != 'undefined' && current_user_id != ''){
                    whereObject.USERID = current_user_id;
            }else{
                if(email != undefined && email != 'undefined' && email != ''){
                      whereObject.EMAIL = email;
                  }
            }
            if(whereObject){
                db.User.find({where: whereObject}).then(function(user){
                    var fullname = profile.displayName.split(" ");
                    var fname = fullname[0];
                    var lname = fullname[1];
                    var updateConnect = "";
                    if(!user){ 
                        
                        updateConnect = {'connections':{'twitter':1}};
                        updateConnect.connections = JSON.stringify(updateConnect.connections);
                       
                        db.User.create({
                            twitterUserId: profile.id,
                            GIVNAME: fname,
                            SURNAME : lname,
                            USERNAME: profile.username,
                            EMAIL: email,
                            provider: provider,
                            tw_token: token,
                            tw_secret: tokenSecret,
                            connections : updateConnect.connections
                        }).then(function(u){ 
                            if(u.USERID){
                                db.Login.create({
                                    userId: u.USERID,
                                    givname: profile.displayName,
                                    username: profile.username,
                                    password:socialPass,
                                    role: 'U'
                                }).then(function(l){  
                                   // UserLoginInJava(u); 
                                        db.Login.update({online:1},{where:{userId:l.userId}});
                                        db.User.update({online:1},{where:{USERID:l.userId}}); 
                                    winston.info('New User (twitter) : { id: ' + u.USERID + ', username: ' + u.USERNAME + ' }');
                                    winston.info('New Login (twitter) : { id: ' + l.userId + ', username: ' + l.username + ' }');
                                    done(null, u);
                                });
                            }
                        });
                    } else { 
                        if(user.connections != '' && user.connections != null){
                            updateConnect = {'connections':JSON.parse(user.connections)};
                            updateConnect.connections['twitter'] = 1;
                        } else {
                            updateConnect = {'connections':{'twitter':1}};
                        }
                        updateConnect.connections = JSON.stringify(updateConnect.connections);
                        db.User.update({
                            twitterUserId: profile.id,
                            tw_token: token,
                            tw_secret: tokenSecret,
                            connections : updateConnect.connections
                        }, {
                          where: whereObject
                        });
                       // UserLoginInJava(user); 
                        db.Login.update({online:1},{where:{userId:user.USERID}}); 
                        db.User.update({online:1},{where:{USERID:user.USERID}}); 
                        winston.info('Login (twitter) : { id: ' + user.USERID + ', username: ' + user.USERNAME + ' }');
                        done(null, user);
                    }

                }).catch(function(err){
                    done(err, null);
                });
            }
        });
    }
));

// Use facebook strategy
passport.use(new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id' ,'email', 'displayName', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },
    function(accessToken, refreshToken, profile, done) {
        if(accessToken != '' && accessToken != undefined && accessToken != 'undefined'){
            localStorage.setItem('fb_token', accessToken);
        }
        if(refreshToken != '' && refreshToken != undefined && refreshToken != 'undefined'){
            localStorage.setItem('fb_rtoken', refreshToken);
        }

        var FacebookID      = profile.id;
       // var username        = profile.username;
        var displayName     = profile.displayName;
        var givenName       = profile.name.givenName;
        var familyName      = profile.name.familyName;
        var middleName      = profile.name.middleName;
        var gender          = profile.gender;
        var profileUrl      = profile.profileUrl;
        var email           = profile.emails[0].value;
        var provider        = profile.provider;
        var current_user_id = localStorage.getItem('current_user_id');
        console.log('current_user_id');
        console.log(current_user_id);
            var whereObject = {};
            if(current_user_id != undefined && current_user_id != 'undefined' && current_user_id != ''){
                    whereObject.USERID = current_user_id;
            }else{
                if(email != undefined && email != 'undefined' && email != ''){
                      whereObject.EMAIL = email;
                  }
            }
        if(whereObject){
            db.User.find({where : whereObject}).then(function(user){
                //use where as facebookUserId for a good reason
                if(!user){
                    db.User.create({
                        GIVNAME: givenName,
                        SURNAME:familyName,
                        GENDER:gender,
                        EMAIL: email,
                        USERNAME: email,
                        provider: provider,
                        facebookUserId: FacebookID,
                        fb_token: accessToken,
                        fb_rtoken: refreshToken,
                    }).then(function(u){
                        if(u.USERID){
                            db.Login.create({
                                userId: u.USERID,
                                givname: givenName,
                                surname: familyName,
                                username: email,
                                password:socialPass,
                                role: 'U'
                            }).then(function(l){ 
                                //UserLoginInJava(u); 
                                    db.Login.update({online:1},{where:{userId:l.userId}});
                                    db.User.update({online:1},{where:{USERID:l.userId}});   
                                winston.info('New User (facebook) : { id: ' + u.USERID + ', username: ' + u.USERNAME + ' }');
                                winston.info('New Login (facebook) : { id: ' + l.userId + ', username: ' + l.username + ' }');
                                done(null, u);
                            });
                        }

                    });
                } else {
                    db.User.update({
                        facebookUserId: FacebookID,
                        fb_token: accessToken,
                        fb_rtoken: refreshToken,
                    }, {
                      where:whereObject
                    });
                    //UserLoginInJava(user);
                        db.Login.update({online:1},{where:{userId:user.USERID}}); 
                        db.User.update({online:1},{where:{USERID:user.USERID}}); 
                    winston.info('Login (facebook) : { id: ' + user.USERID + ', username: ' + user.USERNAME + ' }');
                    done(null, user);
                }
            }).catch(function(err){
                done(err, null);
            });
        }
    }
));

//Use google strategy
passport.use(new GoogleStrategy({
    clientID        : config.google.clientID,
    clientSecret    : config.google.clientSecret,
    callbackURL     : config.google.callbackURL,
    //returnURL: config.google.callbackURL,
    //realm: config.google.realm
  },
  function(token, refreshToken, profile, done) {
        if(token != 'undefined' && token != undefined){
            localStorage.setItem('go_token', token);
        }
        if(refreshToken != 'undefined' && refreshToken != undefined){
            localStorage.setItem('go_rtoken', refreshToken);   
        }
        var current_user_id = localStorage.getItem('current_user_id');
        console.log('current_user_id');
        console.log(current_user_id);
            
        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {
            var GoogleID      = profile.id;
           // var username        = profile.username;
            var displayName     = profile.displayName;
            var givenName       = profile.name.givenName;
            var familyName      = profile.name.familyName;
            var middleName      = '';//profile.name.middleName;
            var photos          = profile.photos[0].value;
            var gender          = profile.gender;
            var email           = profile.emails[0].value;
            var provider        = profile.provider;

            var whereObject = {};
            if(current_user_id != undefined && current_user_id != 'undefined' && current_user_id != ''){
                    whereObject.USERID = current_user_id;
            }else{
                if(email != undefined && email != 'undefined' && email != ''){
                    whereObject.EMAIL = email;
                }
            }
            if(whereObject){
                    db.User.find({where : whereObject}).then(function(user){
                        if(!user){
                            db.User.create({
                                GIVNAME: givenName,
                                SURNAME:familyName,
                                GENDER:gender,
                                EMAIL: email,
                                USERNAME: email,
                                provider: provider,
                                openID: GoogleID,
                                go_token: token,
                                go_rtoken: refreshToken,
                            }).then(function(u){
                                if(u.USERID){
                                    db.Login.create({
                                        userId: u.USERID,
                                        givname: givenName,
                                        surname: familyName,
                                        username: email,
                                        password:socialPass,
                                        role: 'U'
                                    }).then(function(l){
                                       // UserLoginInJava(u);  
                                        db.Login.update({online:1},{where:{userId:l.userId}});    
                                        db.User.update({online:1},{where:{USERID:l.userId}});    
                                        winston.info('New User (Google) : { id: ' + u.USERID + ', username: ' + u.USERNAME + ' }');
                                        winston.info('New Login (Google) : { id: ' + l.userId + ', username: ' + l.username + ' }');
                                        done(null, u);
                                    });
                                }
                                
                            });
                        } else {
                            db.User.update({
                                openID: GoogleID,
                                go_token: token,
                                go_rtoken: refreshToken,
                            }, {
                              where: whereObject
                            });
                          //  UserLoginInJava(user); 
                            db.Login.update({online:1},{where:{userId:user.USERID}});
                            db.User.update({online:1},{where:{USERID:user.USERID}}); 
                            winston.info('Login (Google) : { id: ' + user.USERID + ', username: ' + user.USERNAME + ' }');
                            done(null, user);
                        }
                    }).catch(function(err){
                        done(err, null);
                    });
                }
        });
    }
));


function UserLoginInJava(user) {
    var USERNAME  = user.USERNAME;
    var body = '';
    var data = [];
    var url = ApiBasePath+'loginSocialSimple/'+USERNAME;
    var options = {
        hostname: ip,
        port: '8080',
        path: url,
        method: 'GET',
        headers: headers
    };
    var req = http.request(options,function(res2){
        res2.on('data', function(chunk) {
             body += chunk;
        });
        res2.on('end', function() { 
           var dataJson = JSON.parse(body);
            if(dataJson !== undefined){
                var key = dataJson.key;
                var UserID = dataJson.usr.userid;
                if(key !== undefined){
                      localStorage.setItem('key_'+UserID, key);
                      localStorage.setItem('UserID', UserID);
                }
            }
        });
    });
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    req.end();
}
module.exports = passport;