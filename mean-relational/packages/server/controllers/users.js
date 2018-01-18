'use strict';
var fs = require('fs');
//var sharp = require('sharp');
//var smartcrop = require('smartcrop-sharp');
//var Cropper = require('cropperjs')
var querystring = require("querystring");
var db          = require('../../../config/sequelize');
var http        = require('http');
var LocalStorage = require('node-localstorage').LocalStorage,
   localStorage = new LocalStorage('./scratch');
 var Twitter  = require('twitter');
 var client   = new Twitter({
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
        console.log('Login Current User with ID '+ user_id);
        localStorage.setItem('current_user_id',user_id);  
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


exports.tumblrSaveBlog = function(req, res){
  var usrId = req.user.USERID;
  console.log(usrId);
   tmblr_client.userInfo(function(err, data) {
   if(data !== undefined && data !== '' && data !== null) {
      if(typeof data.user.blogs != 'undefined' && typeof data.user.blogs[0] != 'undefined') {
        var blogName = data.user.blogs[0].name; 
        req.session.tb_blog = blogName;
        db.User.update({tumblr_blog:blogName},{where:{USERID:usrId}}).then(function(user){
          console.log(user);
        }).catch(function(err){
          console.log(err);
        });
        res.redirect('/all-products');
      }
    } else res.redirect('/all-products');
  });
}


/**
 * Show sign up form
 */
exports.signup = function(req, res) {
     localStorage.removeItem('grp_cartId');
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
          req.logout();
          res.redirect('/');
    }

    
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
    var user = db.User.build(req.body);
    var login = db.Login.build(req.body);

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
          if(err) {
            return res.status(400).json(err);
          }
          //send mail to user here;
          if(user){
           var body  = '';
           var data = new Object();
               data.email = user.EMAIL;
               data.subject = 'Anerve Registration';
               data.msg = 'Hi, Thanks for registering with Anerve. Your username: '+user.USERNAME+'. Happy Shopping with firends';
            var qs = querystring.stringify(data);
            var qslength = qs.length;   
            var url = '/demos/anerve/mail.php';
            var options = {
                hostname: 'ctsdemo.com',
                port: '80',
                path: url,
                method: 'POST',
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': qslength
                }
            };
              var buffer = "";
              var req = http.request(options, function(res) {
                  res.on('data', function (chunk) {
                     buffer+=chunk;
                  });
                  res.on('end', function() {
                  });
              });

              req.write(qs);
              req.end();
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
    res.jsonp(req.user || null);
};

/**
 * Find user by USERID
 */
exports.user = function(req, res, next, USERID) {
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
  if (user_id) {
        localStorage.setItem('key_'+user_id,key); 
    } else {
        //not logged in
        localStorage.setItem('key',key);
    }
      
   return res.send(200, 'Key Added To Session '+key);        
 };

 // get all users
 exports.AllUsers = function(req, res){
    var Query = '';
    if (req.user) {
               var USERID = req.user.USERID;
              //db.product.findAll().then(function(product){
             /* db.User.findAll().then(function(users){
                    return res.jsonp(users);
             });*/
              // get current user cart id
         
          Query = 'SELECT gu.grp_cartId FROM group_cart_users gu WHERE gu.userid = '+USERID+' AND gu.userRole = "O" ORDER BY gu.`groupCartuserId` DESC LIMIT 1';
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
    }else{
      //get All USers or return false
      var grp_cartId = localStorage.getItem('grp_cartId');   
       Query = 'SELECT u.USERID as userid, u.GIVNAME, u.SURNAME, u.online, u.user_img, u.img_loc, gu.action, gu.userid as followId FROM users u'+
            ' LEFT JOIN group_cart_users gu ON gu.userid = u.`USERID`'+
            ' AND gu.grp_cartId = '+grp_cartId+' AND gu.action = 2';    
            db.sequelize.query(Query,{raw: false}).then(users => {
                return res.jsonp(users[0]);
            });
    }
 };


 /**
 * Show an user
 */
exports.show = function(req, res) {
    // Sending down the user that was just preloaded by the users.user function
    // and saves user on the req object.
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
      fs.unlink('/public/assets/'+req.body.img_loc, function(err){
          if(err) {
            console.log(err);
          } else{
          }
     });
    }

    user.updateAttributes(newuser).then(function(a){
        // return res.jsonp(a);
        res.redirect('/users/'+req.user.USERID+'/edit');
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Update a user
 */
exports.updateuserprofileimage = function(req, res) {

    // create a new variable to hold the user that was placed on the req object.
    var user = req.user;
    var newuser = {};
    if(typeof req.file != 'undefined'){
      newuser['img_loc'] = 'anerve/usr_images/'+req.file.filename;
      // delete previous image
      fs.unlink('/assets/'+req.body.img_loc, function(err){
          if(err) {
            console.log('/assets/'+req.body.img_loc);
            console.log(err);
          } else{
              res.jsonp(newuser);
          }
     });
    }

    user.updateAttributes(newuser).then(function(a){
        // return res.jsonp(a);
        res.jsonp(newuser);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Update a user
 */
exports.updateusercoverimage = function(req, res) {
    // create a new variable to hold the user that was placed on the req object.
    var user = req.user;
    var newuser = {};
    if(typeof req.file != 'undefined'){
      newuser['user_img'] = 'anerve/usr_images/'+req.file.filename;
      // delete previous image
      fs.unlink('/assets/'+req.body.img_loc, function(err){
          if(err) {
            console.log('/assets/'+req.body.img_loc);
            console.log(err);
          } else{

          }
     });  
    }

    user.updateAttributes(newuser).then(function(a){
        // return res.jsonp(a);
        res.jsonp(newuser);
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
};


// get user timeline
exports.timeline = function(req, res){
   
  if(req.user){
    var tw_usrId = req.user.twitterUserId; // logged in user twitter id
    var userId = req.user.USERID;
    var socialUsrId = userId;
    var limit
    if (req.body.userId != undefined && req.body.userId != ''){
      socialUsrId = req.body.userId;
    }
    if(req.body.limit != undefined && req.body.limit != ''){
      limit = req.body.limit;
    }else {
      limit = 4;
    }

      if (userId != socialUsrId) { // if the user is not logged in one, get twitter id
          db.User.findAll({
            where: {
              USERID: socialUsrId
            }
          }).then(function(users){
            if(users[0] && users[0].twitterUserId != null){
              var params = {count:limit, user_id:users[0].twitterUserId};
              console.log(params);
              client.get('statuses/user_timeline', params, function(error, tweets, response) {
                  return res.jsonp(tweets);
              });
            }

          }).catch(function(err){
              return res.render('error', {
                  error: err,
                  status: 500
              });
          });
      }else if(tw_usrId != null){
        var params = {count:limit, user_id:tw_usrId};
        client.get('statuses/home_timeline', params, function(error, tweets, response) {
            return res.jsonp(tweets);
        });
      }

  }else{ 
    return res.jsonp(''); 
  }
};
// like tweet
exports.likeTweet = function(req, res){
  var tweetId = req.body.id;
  var params = {id:tweetId};
  client.post('favorites/create', params, function(error, tweet, response) {
      return res.jsonp(tweet);
  });
};
// dislike tweet
exports.dislikeTweet = function(req, res){
  var tweetId = req.body.id;
  var params = {id:tweetId};
  client.post('favorites/destroy', params, function(error, tweet, response) {
      return res.jsonp(tweet);
  });
};
// delete tweet
exports.delTweet = function(req, res){
  var tweetId = req.body.id;
  var params = {id:tweetId};
  client.post('statuses/destroy', params, function(error, tweet, response) {
      return res.jsonp(tweet);
  });
};
// post tweet
exports.postTweet = function(req, res){
  var msg = req.body.msg;
  var params = {status:msg};
  client.post('statuses/update', params, function(error, tweet, response) {
      return res.jsonp(tweet);
  });
};
// tumblr apis

exports.tumblrPosts = function(req, res){
  var blogName = req.user.tumblr_blog; // logged in user tumblr blog
  var logInUserId = req.user.USERID;
  var reqUserId = logInUserId;
  var limit;
  if(req.body.userId != undefined && req.body.userId != '')
    reqUserId = req.body.userId;

  if(req.body.limit != undefined && req.body.limit != '')
    limit = req.body.limit;
  else limit = 4;

  if(reqUserId != logInUserId){
    db.User.findAll({
        where: {USERID: reqUserId}
      }).then(function(users){
        if(users[0] && users[0].tumblr_blog != null && users[0].tumblr_blog != ''){
          tmblr_client.blogPosts(users[0].tumblr_blog, {limit:limit}, function(err, resp) {
            return res.jsonp(resp.posts); // use them for something
          });  
        }
      }).catch(function(err){
          return res.render('error', {
              error: err,
              status: 500
          });
      });
  } else {
    tmblr_client.blogPosts(blogName, {limit:limit}, function(err, resp) {
      return res.jsonp(resp.posts); // use them for something
    });  
  }  


  /*tmblr_client.userInfo(function(err, data) {

   if(data !== undefined && data !== '' && data !== null) {
      if(typeof data.user.blogs != 'undefined' && typeof data.user.blogs[0] != 'undefined') {
       
      }
    }
  });*/
};
// Delete a given post
exports.delTumblrPost = function(req, res){
  var blogName = req.body.blogName;
  var postId = req.body.postId;
  tmblr_client.deletePost(blogName, postId, function(err, resp) {
    return res.jsonp(resp.posts);
  });
};

// post tumblr
exports.postTumblr = function(req, res){
  var msg = req.body.msg;
  var params = {body:msg};
  tmblr_client.userInfo(function(err, data) {
   if(data !== undefined && data !== '' && data !== null) {
      if(typeof data.user.blogs != 'undefined' && typeof data.user.blogs[0] != 'undefined') {
        var blogName = data.user.blogs[0].name;   
        tmblr_client.createTextPost(blogName, params, function(err, resp) {
          return res.jsonp(resp.posts);
        }); 
      }
    }
  });
};

// post tumblr photo
exports.postTumblrPhoto = function(req, res){
  var params = {type : 'photo'};
  if(req.body.src != undefined && req.body.src != null)
    params.source = req.body.src;
  else 
    params.data64 = req.body.data.replace(/^data:image\/\w+;base64,/, "");
  tmblr_client.userInfo(function(err, data) {
   if(data !== undefined && data !== '' && data !== null) {
      if(typeof data.user.blogs != 'undefined' && typeof data.user.blogs[0] != 'undefined') {
        var blogName = data.user.blogs[0].name;   
        tmblr_client.createPhotoPost(blogName, params, function(err, resp) {
          return res.jsonp(resp);
        }); 
      }
    }
  });
}

// post tumblr video
exports.postTumblrVideo = function(req, res){
  var params = {type : 'video'};
  if(req.body.vid_src != undefined && req.body.vid_src != null)
    params.embed  = req.body.vid_src;
  else 
    params.data = req.body.data;
  console.log(params);
  tmblr_client.userInfo(function(err, data) {
   if(data !== undefined && data !== '' && data !== null) {
      if(typeof data.user.blogs != 'undefined' && typeof data.user.blogs[0] != 'undefined') {
        var blogName = data.user.blogs[0].name;   
        tmblr_client.createVideoPost(blogName, params, function(err, resp) {
          console.log(resp);
          return res.jsonp(resp.posts);
        }); 
      }
    }
  });
}

// post tumblr quote
exports.postTumblrQuote = function(req, res){
  var params = {type : 'quote'};
  if(req.body.quote != undefined && req.body.quote != null){
    params.quote  = req.body.quote;
    if(req.body.source != undefined && req.body.source != null)
      params.source = req.body.source;
  }
  
  tmblr_client.userInfo(function(err, data) {
   if(data !== undefined && data !== '' && data !== null) {
      if(typeof data.user.blogs != 'undefined' && typeof data.user.blogs[0] != 'undefined') {
        var blogName = data.user.blogs[0].name;   
        tmblr_client.createQuotePost(blogName, params, function(err, resp) {
          console.log(resp);
          return res.jsonp(resp);
        }); 
      }
    }
  });
}
// postTumblrLink
exports.postTumblrLink = function(req, res){
  var params = {type : 'link'};
  if(req.body.url != undefined && req.body.url != null){
    params.url  = req.body.url;
    if(req.body.title != undefined && req.body.title != null)
      params.title = req.body.title;

    if(req.body.description != undefined && req.body.description != null)
      params.description = req.body.description;

    if(req.body.thumbnail != undefined && req.body.thumbnail != null)
      params.thumbnail = req.body.thumbnail;

    if(req.body.title != undefined && req.body.title != null)
      params.author = req.body.author;
    
  }
  
  tmblr_client.userInfo(function(err, data) {
   if(data !== undefined && data !== '' && data !== null) {
      if(typeof data.user.blogs != 'undefined' && typeof data.user.blogs[0] != 'undefined') {
        var blogName = data.user.blogs[0].name;   
        tmblr_client.createLinkPost(blogName, params, function(err, resp) {
          console.log(resp);
          return res.jsonp(resp);
        }); 
      }
    }
  });
}

// post media tweet
exports.postMediaTweet = function(req, res){
  console.log(req.body);
  console.log(req.file);
  return res.jsonp('');
}

exports.fbposts = function(req,res){
  if(req.user){
    var usrId = req.user.facebookUserId;
      if(usrId != null){
        FB.api("/me/posts", function (response) {
          return res.jsonp(response);
        });
      }
  }else{
     return res.jsonp('');
  }
};

/*exports.googlePosts = function(req, res){
  plus.people.get({
  userId: 'me',
  auth: oauth2Client
  }, function (err, response) {
    return res.jsonp(response);
  });
}*/


// validate current user key
exports.validatekey = function(req, res){ 
  if (req.user) { 
    var usrId = req.user.USERID;
    var provider = req.user.provider;
    var key = localStorage.getItem('key_'+usrId);
    if(typeof key != 'undefined'){
        var body = '';
        var options = {
            hostname: ip,
            port: '8080',
            path: ApiBasePath+'checkKey/'+key,
            method: 'GET',
            headers: headers
        };
        req = http.request(options,function(res2){
            res2.on('data', function(chunk) {
                 body += chunk;
            });
            res2.on('end', function() {
              var data = JSON.parse(body); 
              if(data == true){
                data = { 'key':key, 'userId':usrId, 'provider':provider};
              }else{ 
                data = false;
              }
              return res.jsonp(data);
            });
        });
        req.end();
      }else{
        return res.jsonp(false);
      }
  } else {
    return res.jsonp(false);
  }
};

exports.getUser = function(req,res) {
       return res.send(req.user);
};

// disconnect social 
exports.disconnectSocial = function(req, res){
  console.log(req.body);
  var type = req.body.type;
  var usrId = req.user.USERID;
  var updateConnect = "";
  db.User.find({where : { USERID: usrId }}).then(function(user){
      if (!user) {
            console.log('no user');
            return res.jsonp({"type":"error","msg":"User not found"});
      } else {
         if(user.connections != null || user.connections != ""){
            updateConnect = {'connections':JSON.parse(user.connections)};
            updateConnect.connections[type] = 0;
          } else {
            updateConnect = {'connections':{}};
            updateConnect.connections[type] = 0;
            console.log('not null');
          }
          updateConnect.connections = JSON.stringify(updateConnect.connections);
          // update db
          user.updateAttributes(updateConnect).then(function(a){
          console.log('Success');
            return res.jsonp({"type":"success","msg":"Successfully Disconnected"});
          }).catch(function(err){
            return res.jsonp({"type":"error","msg":err});
          });
      }
        }).catch(function(err){
            return res.jsonp({"type":"error","msg":err});
        });
      

};
