
'use strict';

/**
* Module dependencies.
*/
var passport = require('passport');

module.exports = function(app) {
// User Routes
var users = require('../controllers/users');

var multer  = require('multer');
var avatarStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'packages/public/assets/anerve/usr_images/');   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);     
    }
});
var upload = multer({ storage: avatarStorage });
var avatarhanlder = upload.single('imgloc');

//app.post('/api/updateuser', avatarhanlder, users.update);
app.post('/api/updateuser', users.update);
// User Routes
app.get('/signin', users.signin);
app.get('/signup', users.signup);
app.get('/signout', users.signout);
app.get('/api/users/me', users.me);
app.route('/api/users')
    .get(users.all);//.post(users.requiresLogin, users.create);

app.route('/api/users/:USERID')
    .get(users.show)
    .put(users.update)
    .delete(users.destroy);

// Setting up the users api
app.post('/api/register', users.create);

app.route('/api/logout')
  .get(users.signout);
  
app.route('/api/login')
       .post(passport.authenticate('local', {
           failureFlash: true
       }), users.login);

app.route('/api/loggedin')
      .get(function(req, res) {
          res.send(req.isAuthenticated() ? req.user : '0');
      });

app.route('/api/SaveUserKey').post(users.SaveUserKey);
// all users
app.route('/api/getAllUsers').get(users.AllUsers);

// Setting the facebook oauth routes
app.get('/api/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signin'
}), users.signin);

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup'
}), users.authCallback);
app.get('/api/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signup'
}), users.authCallback);



// Setting the twitter oauth routes
app.get('/api/auth/twitter', passport.authenticate('twitter', {
    scope:['include_email=true'],
    failureRedirect: '/signin'
}), users.signin);

app.get('/api/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
}), users.authCallback);

/*app.get('/api/auth/twitter',
  passport.authenticate('twitter'));

app.get('/api/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });*/

// Setting the google oauth routes
app.get('/api/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}), users.signin);

app.get('/api/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
}), users.authCallback);

// setting tumblr
app.get('/api/auth/tumblr', passport.authenticate('tumblr', {
    failureRedirect: '/signin'
}), users.signin);

app.get('/api/auth/tumblr/callback', passport.authenticate('tumblr', {
    failureRedirect: '/all-products'
}), function(req, res) {res.redirect('/all-products');});

// Finish with setting up the USERID param
app.param('USERID', users.user);
app.route('/api/timeline').post(users.timeline);
app.route('/api/likeTweet').post(users.likeTweet);
app.route('/api/dislikeTweet').post(users.dislikeTweet);
app.route('/api/delTweet').post(users.delTweet);
app.route('/api/postTweet').post(users.postTweet);
app.route('/api/postMediaTweet', upload.single('twfile')).post(users.postMediaTweet);
app.route('/api/postTumblr').post(users.postTumblr);
app.route('/api/postTumblrPhoto').post(users.postTumblrPhoto);
app.route('/api/postTumblrVideo').post(users.postTumblrVideo);
app.route('/api/postTumblrQuote').post(users.postTumblrQuote);
app.route('/api/postTumblrLink').post(users.postTumblrLink);
app.route('/api/tumblrPosts').post(users.tumblrPosts);
app.route('/api/delTumblrPost').post(users.delTumblrPost);
app.route('/api/fbposts').post(users.fbposts);
app.route('/api/updateCover').post(users.updateCover);
app.route('/api/updateProfileImage').post(users.updateProfileImage);

//app.route('/api/gplus').post(users.googlePosts);
//
app.route('/api/validatekey').get(users.validatekey);


app.route('/api/getUser').get(users.getUser);
app.route('/api/disconnect').post(users.disconnectSocial);

};
