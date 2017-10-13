'use strict';
/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
 //console.log('user server controller');
/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
    console.log('user server controller authCallback');
    res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
     console.log('user server controller signin');
    res.render('users/signin', {
        title: 'Signin',
        message: req.flash('error')
    });
};


exports.login = function(req, res) {
    console.log('user server controller login');
    console.log(req);
    console.log(req.body.EMAIL);
    console.log(req.get('referer'));
    //return ;
    res.json({
        user: req.user,
        redirect: req.get('referer')
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    console.log('user server controller signup');
    res.render('users/signup', {
        title: 'Sign up',
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    console.log('Logout: { USERID: ' + req.user.USERID + ', USERNAME: ' + req.user.USERNAME + '}');
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    console.log('user server controller session');

    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    console.log('create server controller user.js ');
    console.log(req.body);
    var user = db.User.build(req.body);
    console.log('create server controller user.js db.User.build');
    console.log(user);

    user.provider = 'local';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.PASSWORD, user.salt);
    console.log('New User (local) : { USERID: ' + user.USERID + ' USERNAME: ' + user.USERNAME + ' }');

    user.save().then(function(){
      req.logIn(user, function(err){
        console.log(err);
        if(err) {
          console.log(err);
          return res.status(400).json(err);
        }

        res.json(user);
      });
    }).catch(function(err){
        console.log(err);
        res.status(400).json(err);
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    console.log('user server controller me');

    res.jsonp(req.user || null);
};

/**
 * Find user by USERID
 */
exports.user = function(req, res, next, USERID) {
    console.log('user server controller user');

    db.User.find({where : { USERID: USERID }}).then(function(user){
      if (!user) {
        return next(new Error('Failed to load User ' + USERID));
      }
      req.profile = user;
      next();
    }).catch(function(err){
      next(err);
    });
};

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    console.log('user server controller requiresLogin');

    if (!req.isAuthenticated()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.profile.USERID !== req.user.USERID) {
      return res.send(401, 'User is not authorized');
    }
    next();
};
