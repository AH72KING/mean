'use strict';
/**
 * Module dependencies.
 */
var db = require('../../../config/sequelize');
var http = require('http');
var LocalStorage = require('node-localstorage').LocalStorage,
   localStorage = new LocalStorage('./scratch');
 var Twitter = require('twitter');
//var expSession = require('express-session');
 var client = new Twitter({
      consumer_key: 'vz7LHCrSnlS5W2YD1vNfL0R0m',
      consumer_secret: 'km6YqqfomFfqLMeWx5ciFCP460FCB0FbT0BomVnDVyYAgZMDGc',
      access_token_key: localStorage.getItem('tw_token'),
      access_token_secret: localStorage.getItem('tw_secret')
    });

var tumblr = require('tumblr.js');
var tmblr_client = tumblr.createClient({
  consumer_key: 'e5BirzJiZ65hTYdhn152Qxz7AAG150HK6i25Y4QL10VH1Uv1Cd',
  consumer_secret: 'Di2DiV3CBgHhvHajDoKhIUM6w0A7RVTWqiv18RL619uHduCC6D',
  token: localStorage.getItem('tb_token'),
  token_secret: localStorage.getItem('tb_secret')
});

var FB = require('fb');
FB.options({version: 'v2.8', appId: '824770854361592', appSecret: '8599cce8d0533a0ef57ab6c68c395e9c'});
FB.setAccessToken(localStorage.getItem('fb_token'));

var google = require('googleapis');
var plus = google.plus('v1');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(
  '972158488032-4ovojau9eipa5voof0aaoh1qv0v0k0tt.apps.googleusercontent.com',
  'C2zw8rtG4jDBM0LDQrlauGyr',
  'http://localhost:3000/api/auth/google/callback'
);



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

    var USERNAME  = req.user.USERNAME;
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
    var req2 = http.request(options,function(res2){
        res2.on('data', function(chunk) {
          body += chunk;
        });
        res2.on('end', function() { 
          var dataJson = JSON.parse(body);
          var userId = req.user.USERID;
          req.session.UserID = userId;
          req.session['key_'+userId] = dataJson.key;
          console.log(req.session); 
          res.redirect('/');
        });
    });
    req2.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    req2.end();
};

exports.tumblrCallback = function(req, res){
  console.log('test'); return false;
  //res.redirect('/');
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
   
    var Query = 'SELECT gu.grp_cartId FROM group_cart_users gu WHERE gu.userid = '+USERID+' AND gu.userRole = "O" ORDER BY gu.`groupCartuserId` DESC LIMIT 1';
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


 /**
 * Show an user
 */
exports.show = function(req, res) {
    // Sending down the user that was just preloaded by the users.user function
    // and saves user on the req object.
    //console.log(req.profile);
    //req.profile prev return was req.user
    return res.jsonp(req.profile);
};

/**
 * Update a user
 */
exports.update = function(req, res) {

    // create a new variable to hold the user that was placed on the req object.
    var user = req.user;
    var newuser = {
        GIVNAME:  req.body.GIVNAME,
        SURNAME:  req.body.SURNAME,
        USERNAME: req.body.USERNAME,
        GENDER:   req.body.GENDER,
        EMAIL:    req.body.EMAIL,
        COUNTRY:  req.body.COUNTRY,
        About:    req.body.About,
    };
    if(typeof req.file != 'undefined'){
      newuser['img_loc'] = 'anerve/usr_images/'+req.file.filename;
      // delete previous image
      var fs = require('fs');
      fs.unlink('public/assets/'+req.body.img_loc, function(err){
          if(err) {
            console.log('unlink error');
            console.log(err);
          } else
          console.log('file deleted successfully');
     });  
    }

    user.updateAttributes(newuser).then(function(a){
        // return res.jsonp(a);
        res.redirect('/users/'+req.body.USERID+'/edit');
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};


/**
 * Delete an user
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the user that was placed on the req object.
    var user = req.user;

    user.destroy().then(function(){
        return res.jsonp(user);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};


/**
 * List of users
 */
exports.all = function(req, res) {
    db.User.findAll().then(function(users){
        return res.jsonp(users);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.updateuser = function(req, res){
  // req.file is the `avatar` file
  console.log(req.file);
  console.log('post data');
  console.log(req.body);
};


// get user timeline
exports.timeline = function(req, res){
  var usrId = req.user.twitterUserId;
  console.log('username is '+usrId);
    if(usrId != null){
      var params = {count:4, id:usrId};
      client.get('statuses/user_timeline', params, function(error, tweets, response) {
        console.log(response);
          return res.jsonp(tweets);
      });
    }
};
// like tweet
exports.likeTweet = function(req, res){
  var tweetId = req.body.id;
  var params = {id:tweetId};
  client.post('favorites/create', params, function(error, tweet, response) {
    console.log(response);
      return res.jsonp(tweet);
  });
};
// dislike tweet
exports.dislikeTweet = function(req, res){
  var tweetId = req.body.id;
  var params = {id:tweetId};
  client.post('favorites/destroy', params, function(error, tweet, response) {
    console.log(response);
      return res.jsonp(tweet);
  });
};
// delete tweet
exports.delTweet = function(req, res){
  var tweetId = req.body.id;
  var params = {id:tweetId};
  client.post('statuses/destroy', params, function(error, tweet, response) {
    console.log(response);
      return res.jsonp(tweet);
  });
};

// tumblr apis

exports.tumblrPosts = function(req, res){

  tmblr_client.userInfo(function(err, data) {

   if(data !== undefined && data !== '' && data !== null) {
      if(typeof data.user.blogs != 'undefined' && typeof data.user.blogs[0] != 'undefined') {
        var blogName = data.user.blogs[0].name;
        tmblr_client.blogPosts(blogName, {limit:4}, function(err, resp) {
          return res.jsonp(resp.posts); // use them for something
        });    
      }
    }
});
};
// Delete a given post
exports.delTumblrPost = function(req, res){
  var blogName = req.body.blogName;
  var postId = req.body.postId;
  tmblr_client.deletePost(blogName, postId, function(err, resp) {
    return res.jsonp(resp.posts);
  });
};


exports.fbposts = function(req,res){

  var usrId = req.user.facebookUserId;
  console.log('fb userid is '+usrId);
    if(usrId != null){
      FB.api("/me/posts", function (response) {
      /*if(!response || response.error) {
       console.log(!response ? 'error occurred' : response.error);
       return;
      }*/
      return res.jsonp(response);
    });
    }
}

exports.updateCover = function(req, res){
  var buf/* whatever */; 
  console.log('Json data ');
  console.log(req.body.data); 
  //var data = JSON.parse(req.body.data);
  /*if (typeof Buffer.from === "function") {
    // Node 5.10+
    buf = Buffer.from(data, 'base64'); // Ta-da
  } else {
      // older Node versions
      buf = new Buffer(data, 'base64'); // Ta-da
  }
  return res.jsonp(buf);*/
}

/*exports.googlePosts = function(req, res){
  plus.people.get({
  userId: 'me',
  auth: oauth2Client
  }, function (err, response) {
    return res.jsonp(response);
  });
}*/