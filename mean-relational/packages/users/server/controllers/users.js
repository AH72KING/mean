'use strict';
/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var http = require('http');
var LocalStorage = require('node-localstorage').LocalStorage,
   localStorage = new LocalStorage('./scratch');
 //console.log('user server controller');
 //

        //var baseUrl = 'http://localhost:3000/';
        var ip = db.sequelize.config.host;
        //var ApiBaseUrl = 'http://'+ip+':8080/Anerve/anerveWs/AnerveService/';
        var ApiBasePath = '/Anerve/anerveWs/AnerveService/';
        var headers = {
                   'Access-Control-Allow-Origin': '*',
                   'Content-Type' : 'application/json; charset=UTF-8',
                   'Access-Control-Allow-Headers': 'content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                   'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT',
                   'Access-Control-Max-Age': '3600',
                   'Access-Control-Allow-Credentials': 'true'
                };



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
    localStorage.removeItem('grp_cartId');
    var grp_cartId = null;
    var current_total = 0;
    var currency = 'USD';
    if(req.user){
      var user_id = req.user.USERID;
      db.Grpcart.find({where : { owner_userId: user_id }}).then(function(groupcart){

        if(!groupcart){

          console.log('Failed to Get Group Cart ID for user  ' + user_id);
        }else{

          currency      = groupcart.currency; 
          grp_cartId    = groupcart.grp_cartId;
          current_total = groupcart.current_total;
          
          localStorage.setItem('grp_cartId_'+user_id,grp_cartId);   
          localStorage.setItem('current_total_'+grp_cartId,current_total);   
          localStorage.setItem('currency_'+grp_cartId,currency);  
          //UserLoginInJava(req.user);

        }
      }).catch(function(err){
          console.log('error');
          console.log(err);
      });
    }
    res.json({
        user: req.user,
        redirect: req.get('referer')
    });
};




/**
 * Show sign up form
 */
exports.signup = function(req, res) {
     localStorage.removeItem('grp_cartId');
    console.log('user server controller signup');
    res.render('users/signup', {
        title: 'Sign up',
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
   localStorage.removeItem('grp_cartId');

    var url   = '';
    var body  = '';
    var data  = [];
    var key   = '';
    var user_id = 0;

    if (req.user) {
          user_id = req.user.USERID;
          key = localStorage.getItem('key_'+user_id); 
          url = ApiBasePath+'logout/'+key+'/';
          console.log(key);
          console.log(user_id);
          console.log(url);

      var options = {
          hostname: ip,
          port: '8080',
          path: url,
          method: 'GET',
          headers: headers
      };

      var req3 = http.request(options,function(res2){

          res2.on('data', function(chunk) {
               body += chunk;
          });

          res2.on('end', function() { 
              console.log(body);
              
              console.log('Logout: { USERID: ' + user_id +'}');
               db.Login.update({online:0},{where:{userId:user_id}});
               db.User.update({online:0},{where:{USERID:user_id}});
              req.logout();
              res.redirect('/');
          });
      });
      
      req3.on('error', function(e){
        console.log('problem with request:'+ e.message);
      });

      req3.end();

    }else{
          console.log('already logout from java server now logging out from mean');
          console.log('Logout: { USERID: ' + req.user.USERID + '}');
          req.logout();
          res.redirect('/');
    }

    
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
   // console.log(req.body);
    var user = db.User.build(req.body);
    var login = db.Login.build(req.body);
    console.log('create server controller user.js db.User.build');
    //console.log(user);

    user.provider = 'local';
    user.online = 1;
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.PASSWORD, user.salt);

    login.role = 'U';
    login.username = user.USERNAME;
    login.password = user.hashedPassword;
    login.online = 1;

    user.save().then(function(user){
      console.log('New User (local) : { USERID: ' + user.USERID + ' USERNAME: ' + user.USERNAME + ' }');

      login.userId = user.USERID;

      login.save().then(function(){
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


/**
 * Save User authorizations key for Java Use
 */
exports.SaveUserKey = function(req, res){
  var user_id = req.body.UserID;
  var key = req.body.key;
  console.log(key);
  console.log(user_id);
  if (user_id) {
        console.log('logged in user runs ');
        console.log(user_id);
        localStorage.setItem('key_'+user_id,key); 
    } else {
        //not logged in
        console.log('not logged in user runs why ');
        localStorage.setItem('key',key);
    }
      
   return res.send(200, 'Key Added To Session '+key);        
 };

 // get all users
 exports.AllUsers = function(req, res){
    if (req.user) {
         var USERID = req.user.USERID;
      //db.product.findAll().then(function(product){
   /* db.User.findAll().then(function(users){
          return res.jsonp(users);
   });*/
    // get current user cart id
   
    var Query = "SELECT gu.grp_cartId FROM group_cart_users gu WHERE gu.userid = "+USERID+" AND gu.userRole = 'O' ORDER BY gu.`groupCartuserId` DESC LIMIT 1";
   var userCartId = 0;
   db.sequelize.query(Query,{raw: false}).then(result => {
      if(typeof result[0][0] != 'undefined' && result[0][0]['grp_cartId'] != null){
          userCartId = result[0][0]['grp_cartId'];
      }
      Query = 'SELECT u.USERID as userid, u.GIVNAME, u.SURNAME, u.online, u.user_img, u.img_loc, gu.action, gu.userid as followId FROM users u'+
      ' LEFT JOIN group_cart_users gu ON gu.userid = u.`USERID`'+
      ' AND gu.grp_cartId = '+userCartId+' AND gu.action = 2 WHERE u.USERID != '+USERID; 
      
      db.sequelize.query(Query,{raw: false}).then(users => {
          return res.jsonp(users[0]);
      });
    });
  }
 };