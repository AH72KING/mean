(function(){
'use strict';
var $anerveModule =  angular
      .module('Anerve');
      $anerveModule.
      filter('capitalize', function() {
          return function(input) {
            return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
          };
        }
      );

    $anerveModule.directive('fallbackSrc', function () {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function() {
                    angular.element(this).attr("src", iAttrs.fallbackSrc);
                });
            }
        };
        return fallbackSrc;
    });

    $anerveModule.controller('HeaderController',HeaderController);
    
    HeaderController.$inject = ['$http', '$state', '$location', '$scope', 'Global','$mdSidenav', '$mdUtil','$log', 'Session','$rootScope', '$window', 'MeanUser'];

    function HeaderController($http, $state, $location, $scope, Global, $mdSidenav, $mdUtil, $log, Session, $rootScope, $window, MeanUser){
        $scope.isNotLogOut = false;
        $rootScope.isLoaded = false;
        $rootScope.ip  = window.ip;
        $rootScope.baseUrl    = 'http://34.214.120.75:3000/';
        $rootScope.ApiUploadUrl = 'http://'+$rootScope.ip+'/uploads/';
        $rootScope.UploadUrl  = 'http://34.214.120.75:3000/public/assets/';
        $rootScope.ApiBaseUrl = 'http://'+$rootScope.ip+'/Anerve/anerveWs/AnerveService/';
        $rootScope.headers    = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type' : 'application/json; charset=UTF-8',
            'Access-Control-Allow-Headers': 'content-type, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
            'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        };  

             $rootScope.twitterConnect  = 'link it';
             $rootScope.tumblrConnect   = 'link it';
             $rootScope.facebookConnect = 'link it';
             //$rootScope.googleConnect   = 'link it';
             $rootScope.instagramConnect   = 'link it';

             $rootScope.provider = 'local';
        $http.get($rootScope.baseUrl+'api/getUser').then(function(result) { 
           var currentUserChecker = $rootScope.currentUser = result.data;

           console.log('currentUser');
           console.log($rootScope.currentUser);

             
           console.log(currentUserChecker.openId );
           if(currentUserChecker != undefined && currentUserChecker != 'undefined' && currentUserChecker != ''){
              if(currentUserChecker.connections != null && currentUserChecker != ""){
                var connections = JSON.parse(currentUserChecker.connections);
                console.log('test '+connections.twitter);
                 if(connections.twitter != undefined && connections.twitter != 0){
                   $rootScope.twitterConnect = 'Unlink';
                   $rootScope.twitterUserId = currentUserChecker.twitterUserId;
                 }
                 if(connections.tumblr != undefined && connections.tumblr != 0){
                   $rootScope.tumblrConnect = 'Unlink';
                 }
                 if(connections.facebook != undefined && connections.facebook != 0){
                   $rootScope.facebookConnect = 'Unlink';
                   $rootScope.facebookUserId  = currentUserChecker.facebookUserId;
                 }
                 if(connections.instagram != undefined && connections.instagram != 0){
                   $rootScope.instagramConnect = 'Unlink';
                   $rootScope.ig_id = currentUserChecker.ig_id;
                 }
                /* if(connections.google != undefined && connections.google != 0){
                   $rootScope.googleConnect = 'Unlink';
                   $rootScope.openId = currentUserChecker.openId;
                 }*/
              }
               $rootScope.provider = currentUserChecker.provider;
           }
           $rootScope.socialApps = [
            { 'name':'Twitter', 'key':'twitter', 'href':'/api/auth/twitter',  'connect':$rootScope.twitterConnect },
            { 'name':'Tumblr',  'key':'tumblr',  'href':'/api/auth/tumblr',   'connect':$rootScope.tumblrConnect},
            { 'name':'Facebook','key':'facebook','href':'/api/auth/facebook', 'connect':$rootScope.facebookConnect},
            { 'name':'Instagram',  'key':'instagram',  'href':'/api/auth/instagram',   'connect':$rootScope.instagramConnect},
          ];
          console.log($rootScope.socialApps);
        });
        $rootScope.cartTotalPrice        = 0;
        //check key if expire, then logout user
        // validate key
        
         $rootScope.SideBarLeftMenuItems = [
            {
                name: "Profile",
                subItems: [
                    {name: "View Profile"},
                    {name: "Edit Profile"}
                ]
            },
            {
                name: "My Anerve",
                subItems: [
                    {name: "My Orders"},
                    {name: "My Firends"},
                    {name: "SubItem5"}
                ]
            },
            {
                name: "Friends",
                subItems: [
                    {name: "My Firends"},
                    {name: "My Network"},
                    {name: "People"}
                ]
            },
            {
                name: "Buiness",
                subItems: [
                    {name: "About Anerve"},
                    {name: "Contact Us"},
                    {name: "Term & Conditions"}
                ]
            }
        ];

        $rootScope.twfile = '';
        $rootScope.postModal = {
          modalClass : 'hide-al',
          currentSocial : 'twitter',
          postype : 'Text',
          index : '',
          postId : ''
        };

        //social post types
        $rootScope.postTypes = {
          tumblr : ['Text', 'Photo', 'Quote', 'Link', 'Video', 'Audio'],
          twitter: ['Text']
        };

        $rootScope.data = {
          'tb_text':'',
          'tb_src' :'',
          'tb_quote' :'',
          'tb_source' :'',
          'tb_vid_src' :'',
          'tb_link_title' :'',
          'tb_link' :'',
          'tb_link_desc' :'',
          'tb_link_thumb' :'',
          'tb_link_auth' :'',
        };

        $rootScope.showMenuChilds = function(item){
            item.active = !item.active;
        };
        $rootScope.selectAisleID = function (aisle) { 
            console.log(aisle);            //aisleId aisle_description aisle_name aisle_number
            $rootScope.AislesIsSelected    = true;
            $rootScope.AislesSelectedID    = aisle.aisleId;
            $rootScope.AislesSelectedName  = aisle.aisle_name;
            $rootScope.AislesSelectedDesc  = aisle.aisle_description;
            
           $rootScope.emptyAllProductCols();
            if($rootScope.NoMoreProductToFetch){
              $rootScope.startTimeout();
            }
        };
        $rootScope.emptyAllProductCols = function () {
            $rootScope.lastProductID = 0;
            $rootScope.products['col1'] = [];
            $rootScope.products['col2'] = [];
            $rootScope.products['col3'] = [];
            $rootScope.products['col4'] = [];
            if($rootScope.NoMoreProductToFetch){
              $rootScope.startTimeout();
            }

        };
        $rootScope.getAllProducts = function () {
            $rootScope.emptyAllProductCols();
            $rootScope.AislesIsSelected = false;
        };
        // get prod by aisle
        $rootScope.getProdByAisle = function(index){
          var id = "";
          if(index !== undefined && index !== 'undefined' && index !== ''){
            id = $rootScope.aisles[index].aisleId;
          }

          var url = $rootScope.baseUrl+'api/getAisleProd';
          var postData = {'id':id};
          var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
         // notify('Loading Products...','info');
          $http(configObj)
              .then(function onFulfilled(response) {
                  for(var i = 1; i <= 4; i++){
                    $rootScope.products['col'+i] = response.data['col'+i];
                  }
                closeNoti();
                if(index !== undefined && index !== 'undefined' && index !== ''){
                  var $msg = $rootScope.aisles[index].aisle_name+' Products Loaded';
                }else{
                  var $msg = "All Products Loaded";
                  notify($msg,'success');
                }
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          }); 
        };
        $rootScope.validatekey= function(){

          var url = $rootScope.baseUrl+'api/validatekey';
          var configObj = { method: 'GET',url: url, headers: $rootScope.headers};
          $http(configObj)
              .then(function onFulfilled(response) {
                  if(response.data == false){
                    if($scope.isNotLogOut){
                      $scope.isNotLogOut = true;
                      logout();
                    }
                  }else if(response.data != false && response.data != true) {
                    Session.setItem('UserID',response.data.userId);
                    Session.setItem('key_'+response.data.userId, response.data.key);
                    $rootScope.provider = response.data.provider;
                  }
              }).catch( function onRejection(errorResponse) {
                console.log(errorResponse);
              });
        };
        $rootScope.validatekey();
        $rootScope.defaultAvatar = 'http://localhost:3000/public/assets/images/default-avatar.png';
        var vm = this;
        vm.global = Global;
        
        vm.meanuser = MeanUser;
        $rootScope.userImg = Session.getItem('img_loc');
        vm.menu = [
        /*{
            'title': 'products',
            'link': 'products'
        }, {
            'title': 'Create New product',
            'link': 'create-product'
        },*/ {
            'title': 'users',
            'link': 'users'
        }];

        vm.isCollapsed = false;
        vm.logout = logout;

        function logout(){
          $http.get('/api/logout').then(function() {
            Session.removeItem('UserID');
              vm.global = {
                user: false,
                authenticated: false
              };

              //$state.go('auth.login');
              ///$state.go('home');
              ///$state.go('home');
              //$location.url('/');
              $window.location.href = '/';

            },function(err){
                console.log(err);
            }
          );
        }
        $rootScope.toggleLeft     = buildToggler('left');
        $rootScope.toggleCart     = buildToggler('cart');
        $rootScope.ProductDetail  = buildToggler('ProductDetail');
        $rootScope.UserDetail     = buildToggler('UserDetail');
        $rootScope.lockLeft = false;
        $rootScope.lockRight = false;
        $rootScope.lockProductDetail = false;
        $rootScope.lockUserDetail = false;

        
        $rootScope.isLeftOpen = function() {
          return $mdSidenav('left').isOpen();
        };
        $rootScope.isCartOpen = function() {
          return $mdSidenav('cart').isOpen();
        };
        $rootScope.isProductDetailOpen = function() {
          return $mdSidenav('ProductDetail').isOpen();
        };
        $rootScope.isUserDetailOpen = function() {
          return $mdSidenav('UserDetail').isOpen();
        };

        $rootScope.getDefaultAvatar = function(url){
          if(url == null){
            url = '/images/default-avatar.png'; 
          }else {
            //url = '/images/default-avatar.png'; 
           /* var link = $rootScope.UploadUrl+url;
            var http = new XMLHttpRequest();
            http.open('HEAD', link, false);
            http.send();
            if(http.status==404){localStorage.clear();
              url = '/images/default-avatar.png'; 
            }*/
          }
          return url;
       };
        // get friend request
        $rootScope.friendRequests = function(){
          if(typeof Session.getItem('UserID') != 'undefined'){
            var UserID  =  Session.getItem('UserID');
            if(UserID != null){
              var key   =  Session.getItem('key_'+UserID);
              var url = $rootScope.baseUrl+'api/friendRequests';
              var postData = {'key':key};
              var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
              $http(configObj).then(function onFulfilled(response) {
                   var dataJson    = JSON.parse(JSON.stringify(response.data));
                   $rootScope.requests = dataJson;
              }).catch( function onRejection(errorResponse) {
                  console.log(errorResponse);
              });    
            }
          }
        };
        try {
          $rootScope.friendRequests();
        }
        catch(e){
          console.log(e);
        }
        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildToggler(navID) {
          var debounceFn = $mdUtil.debounce(function() {
            $mdSidenav(navID)
              .toggle()
              .then(function() {
                $log.debug('toggle ' + navID + ' is done');
              });
          }, 300);

          return debounceFn;
        }

        // accept friend request
        $rootScope.acceptRequest = function(userId, index=null){
          var currentUId  =  Session.getItem('UserID');
          if(typeof currentUId != 'undefined' && currentUId != null){
            var key   =  Session.getItem('key_'+currentUId);
              var url = $rootScope.baseUrl+'api/acceptRequest';
              var postData = {'key':key,'userId':userId};
              var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
              $http(configObj).then(function onFulfilled(response) {
                   var dataJson    = JSON.parse(JSON.stringify(response.data));
                   $rootScope.requests.slice(index, 1);
                    if(index === null){
                      $rootScope.CurrentUserBuyerDetail.action = '02';
                    }
                    notify('Friend Request has been Accepted Successfully');
              }).catch( function onRejection(errorResponse) {
                  console.log(errorResponse);
              }); 
          }
        };

         // unfollow user
        $rootScope.unFollow = function(userid){
            var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
              var key   =  Session.getItem('key_'+UserID);
              var url = $rootScope.baseUrl+'api/unfollowUser';
              var postData = {key:key, query_userId:userid};
              var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                $http(configObj).then(function onFulfilled(response) {
                    var dataJson = JSON.parse(JSON.stringify(response.data));
                    console.log(dataJson);
                    $rootScope.CurrentUserBuyerDetail.action = '03';
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
                    console.log(errorResponse);
                });
            }
        };
                  // send friend request
        $rootScope.sendFriendRequest = function(userid){
            var UserID  =  Session.getItem('UserID');
            if(typeof UserID != 'undefined' && UserID != null){
              var key   =  Session.getItem('key_'+UserID);
              var url = $rootScope.baseUrl+'api/followUser';
              var postData = {key:key, query_userId:userid};
              var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                $http(configObj).then(function onFulfilled(response) {
                    var dataJson = JSON.parse(JSON.stringify(response.data));
                    console.log(dataJson);
                    $rootScope.CurrentUserBuyerDetail.action = '01';
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse.status);
                    console.log(errorResponse);
                });
            }
        };

        // getUserCartDetail
        $rootScope.GetFriendCart  = function(USERID) {
                    var url = $rootScope.baseUrl+'api/getUserCartDetail';
                    var postData = {
                      USERID:USERID
                    };
                    var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
                      $http(configObj)
                          .then(function onFulfilled(response) {
                              closeNoti();
                              var newData = JSON.stringify(response.data);
                              newData = JSON.parse(newData);
                              if(newData.isEmpty != 'undefined' && newData.isEmpty == true){
                                notify(newData.msg, newData.type);
                              } else { 
                                $rootScope.CurrentUserBuyerDetail = newData.cartOwner;
                                $rootScope.CurrentUserBuyerProductsDetail = newData.cartProducts;
                                $rootScope.cartUsers = newData.cartUsers;
                                $rootScope.isCartMember = $rootScope.checkInCartUsers(newData.cartUsers);
                                $rootScope.userCartId = newData.cartId;
                                $rootScope.cartComments = newData.cartComments;
                                $rootScope.UserDetail();
                              }
                          }).catch( function onRejection(errorResponse) {
                              console.log('Error: ', errorResponse.status);
                              console.log(errorResponse);
                      });
               
        };
        $rootScope.showFriendCart = function(USERID){
          console.log('user id is');
          console.log(USERID);
          if(angular.isNumber(USERID) ){
            console.log(' cart belong to user id '+ USERID);
            $rootScope.CurrentUserBuyerDetail = $rootScope.GetFriendCart(USERID);
            $rootScope.isUserDetailOpen();
          }
        };
        // check in cart users
        $rootScope.checkInCartUsers = function(crtUsrs){
          var UserID  =  Session.getItem('UserID');
          var isMember = false;
          angular.forEach(crtUsrs,function(value, key){
            if(value['USERID'] == UserID){
              console.log(UserID);
              console.log(key);
              isMember = true;
            }
          });
          return isMember;
        };

        $rootScope.redirectTo = function($url, $action){
          var index;
          if($action != 'Unlink')
            $window.location.href = 'http://localhost:3000'+$url;
          else {
            var social = $rootScope.socialApps.filter(function(item) {
              if (item.href === $url) {
                index = $rootScope.socialApps.indexOf(item);
                return $rootScope.socialApps.indexOf(item);
              }
            })[0];
            var url = $rootScope.baseUrl+'api/disconnect';
            var postData = {type:$rootScope.socialApps[index].key};
            var configObj = { method: 'POST',url: url, data: postData, headers: $rootScope.headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                  notify(response.data.msg, response.data.type);
                  $rootScope.socialApps[index].connect = "link it";
                }).catch( function onRejection(errorResponse) {
            });
          }
        };



        $rootScope.showPostModal = function(type, index = ""){
          console.log('me here with type '+type);
          $rootScope.postModal.modalClass = "show-al";
          $rootScope.postModal.currentSocial = type;
          $rootScope.postModal.index = index;
          $('.html5imageupload').html5imageupload();
        };


        // delete tweet
        $rootScope.deleteTweet = function(index){
          var tweetId = $rootScope.twitterPosts[index]['id_str'];
          var postData = {'id':tweetId};
          var url = $rootScope.baseUrl+'api/delTweet';
          var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
          $http(configObj)
              .then(function onFulfilled(response) {
                if(response.status == 200){
                  if(typeof response.data != 'undefined' && typeof response.data.errors != 'undefined'){
                    var code = response.data.errors[0].code;
                    console.log(code);
                    //if(code == 144) 
                      notify(response.data.errors[0].message);
                  } else {
                    notify('Tweet has been Deleted Successfully','success');
                    $rootScope.twitterPosts.splice(index, 1);
                  }
                }
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          });
        };

        // delete tumblr post
        $rootScope.delTumblrPost = function(index){
          var blogName = $rootScope.tumblrPosts[index].blog_name;
          var postId = $rootScope.tumblrPosts[index].id;
          var postData = {postId:postId, blogName:blogName};
          var url = $rootScope.baseUrl+'api/delTumblrPost';
          var configObj = { method: 'POST',url: url, data:postData,  headers: $rootScope.headers};
          console.log(postData);
          $http(configObj)
              .then(function onFulfilled(response) {
                  $rootScope.tumblrPosts.splice(index, 1);
                  notify('Post Deleted','success');
                  console.log(response);

              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          }); 
        };


        // watch post modal action 
        $rootScope.$watch('postModal.index', function(newVal, oldVal){
          if(newVal != ''){
            // check soical type
            var post = '';
            var currentSocial = $rootScope.postModal.currentSocial;
            switch(currentSocial){
              case 'tumblr':
                post = $rootScope.tumblrPosts[newVal];
                $rootScope.postModal.postype = post.type.charAt(0).toUpperCase() + post.type.substr(1).toLowerCase();             
                $rootScope.postModal.postId = $rootScope.tumblrPosts[newVal].id;  
                switch(post.type){
                  case 'text':
                    $rootScope.data.tb_text = angular.element(post.body).text();
                    break;
                  case 'photo':
                    $rootScope.data.tb_src = post.photos[0].original_size.url;
                    break;
                  case 'video':
                    $rootScope.data.tb_vid_src = post.video_url;
                    break;
                  case 'quote':
                    $rootScope.data.tb_quote = post.text;
                    $rootScope.data.tb_source = post.source;
                    break;
                  case 'link':
                    $rootScope.data.tb_link_title = post.title;
                    $rootScope.data.tb_link = post.url;
                    $rootScope.data.tb_link_desc = angular.element(post.description).text();
                    $rootScope.data.tb_link_thumb = post.link_image;
                    $rootScope.data.tb_link_auth = post.link_author;
                    break;
                }
                break;
              case 'twitter':
              break;

            }
          }
        });

        // post tumblr
        $rootScope.postTumblr = function(){
          var urlMethod, postData;
          if($rootScope.postModal.postype == 'Text' && $rootScope.data.tb_text != null){
            postData = {'msg':$rootScope.data.tb_text};
            urlMethod = "api/postTumblr";
          }else if($rootScope.postModal.postype == 'Photo') {
            if($rootScope.data.tb_src != null){
              postData = {'src':$rootScope.data.tb_src};
            }
            urlMethod = "api/postTumblrPhoto";
            
          }else if($rootScope.postModal.postype == 'Video') {
            if($rootScope.data.tb_vid_src != null){
              postData = {'vid_src':$rootScope.data.tb_vid_src};
            }
            urlMethod = "api/postTumblrVideo";
          }else if($rootScope.postModal.postype == 'Quote') {
            if($rootScope.data.tb_quote != null){
              postData = {'quote':$rootScope.data.tb_quote};
              if($rootScope.data.tb_source != null){
                postData.source = $rootScope.data.tb_source;
              }
            }
            urlMethod = "api/postTumblrQuote";
          }else if($rootScope.postModal.postype == 'Link') {
            if($rootScope.data.tb_link != null){
              postData = {'url':$rootScope.data.tb_link};
              if($rootScope.data.tb_link_title != null)
                postData.title = $rootScope.data.tb_link_title;

              if($rootScope.data.tb_link_desc != null)
                postData.description = $rootScope.data.tb_link_desc;

              if($rootScope.data.tb_link_thumb != null)
                postData.thumbnail = $rootScope.data.tb_link_thumb;

              if($rootScope.data.tb_link_auth != null)
                postData.author = $rootScope.data.tb_link_auth;
              
            }
            urlMethod = "api/postTumblrLink";
            
          }
          
          postData.id = $rootScope.postModal.postId;

          
          var url = $rootScope.baseUrl+urlMethod;
          var configObj = { method: 'POST',url: url, data:postData,  headers: $rootScope.headers};
          
          $http(configObj)
              .then(function onFulfilled(response) {
                  notify('Post Submitted Successfully','success');
                  $rootScope.postModal.modalClass = "hide-al";
                  if($rootScope.postModal.index != ''){
                    editPostData();
                    $rootScope.postModal.index = '';
                  }

              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          });
        };

        function editPostData(){
          switch($rootScope.postModal.postype){
            case 'text':
              $rootScope.tumblrPosts[$rootScope.postModal.index].body = $rootScope.data.tb_text;
              break;
            case 'photo':
              $rootScope.tumblrPosts[$rootScope.postModal.index].photos[0].original_size.url = $rootScope.data.tb_src;
              break;
            case 'video':
              $rootScope.tumblrPosts[$rootScope.postModal.index].video_url = $rootScope.data.tb_vid_src;
              break;
            case 'quote':
              $rootScope.tumblrPosts[$rootScope.postModal.index].text = $rootScope.data.tb_quote;
              $rootScope.tumblrPosts[$rootScope.postModal.index].source = $rootScope.data.tb_source;
              break;
            case 'link':
              $rootScope.tumblrPosts[$rootScope.postModal.index].title = $rootScope.data.tb_link_title;
              $rootScope.tumblrPosts[$rootScope.postModal.index].url = $rootScope.data.tb_link;
              $rootScope.tumblrPosts[$rootScope.postModal.index].description = $rootScope.data.tb_link_desc;
              $rootScope.tumblrPosts[$rootScope.postModal.index].link_image = $rootScope.data.tb_link_thumb;
              $rootScope.tumblrPosts[$rootScope.postModal.index].link_author = $rootScope.data.tb_link_auth;
              break;
          }
        }

        
        $rootScope.likeOrUnlike = function(i, action){
          console.log('Test');
         var socket = new io.Socket('localhost',{'port':3000});
          //socket.connect();

          socket.on('open', function(){
              console.log('connected');
              socket.send('hi!'); 
          });

          socket.on('packet', function(data){ 
              console.log('message recived: ' + data);
          });

          socket.on('close', function(){
              console.log('disconected');
          });

          /*if(action == 'like'){
            var url = $rootScope.baseUrl+'api/likeInsta';
            var msg = "Liked Successfully";
            $rootScope.instagramPosts.data[i].likes.count += 1;
            $rootScope.instagramPosts.data[i].user_has_liked = true;
          }
          else {
            var url = $rootScope.baseUrl+'api/dislikeInsta';
            var msg = "Uniked Successfully";
            $rootScope.instagramPosts.data[i].likes.count -= 1;
            $rootScope.instagramPosts.data[i].user_has_liked = false;
          }
          var postData = {id:$rootScope.instagramPosts.data[i].id};
          var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
          $http(configObj)
              .then(function onFulfilled(response) {
                notify(msg,'success');
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse);
          }); */
        };


          // like tweet
          $rootScope.likeTweet = function(index){
            var tweetId = $rootScope.twitterPosts[index]['id_str'];
            var postData = {'id':tweetId};
            var url = $rootScope.baseUrl+'api/likeTweet';
            var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                  if(response.status == 200){
                   if(typeof response.data != 'undefined' && typeof response.data.errors != 'undefined'){
                    var code = response.data.errors[0].code;
                    if(code == 139) 
                      notify(response.data.errors[0].message);
                    } else {
                      notify('Liked Successfully','success');
                      $rootScope.twitterPosts[index]['favorite_count'] += 1;
                    }
                  }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse);
            });
          };
          // dislike tweet if like
          $rootScope.dislikeTweet = function(index){
            var tweetId = $rootScope.twitterPosts[index]['id_str'];
            var postData = {'id':tweetId};
            var url = $rootScope.baseUrl+'api/dislikeTweet';
            var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
            $http(configObj)
                .then(function onFulfilled(response) {
                  if(response.status == 200){
                    if(typeof response.data != 'undefined' && typeof response.data.errors != 'undefined'){
                      var code = response.data.errors[0].code;
                      if(code == 144) 
                        notify(response.data.errors[0].message);
                    } else {
                      notify('UnLiked Successfully','success');
                      $rootScope.twitterPosts[index]['favorite_count'] -= 1;
                    }
                  }
                }).catch( function onRejection(errorResponse) {
                    console.log('Error: ', errorResponse);
            });
          };
       /*  var socket = io.connect();
          socket.on('news', function (data) {
            console.log(data);
            socket.emit('news', { my: 'just testing socket' });
          });*/



      $rootScope.UserLoginInJava = function (user) {

            var USERNAME  = user.USERNAME;
            var PASSWORD  = user.PASSWORD;
            var postData = {
              'USERNAME':USERNAME,
              'PASSWORD':PASSWORD
            };
            var url = $rootScope.baseUrl+'api/UserLoginInJava';
            var configObj = { method: 'POST',url: url, data:postData, headers: $rootScope.headers};
            $http(configObj).then(function onFulfilled(response) {
               var dataJson = JSON.parse(JSON.stringify(response.data));
                  console.log(dataJson);
                  if(dataJson !== undefined){
                    var key = dataJson.key;
                    var UserID = dataJson.usr.userid;
                    var img_loc = dataJson.usr.img_loc;
                    var givname = dataJson.usr.givname;
                    var surname = dataJson.usr.surname;
                    var username = dataJson.usr.username;
                    console.log(img_loc+' '+givname+' '+surname);
                      if(key !== undefined){
                          Session.setItem('key_'+UserID, key);
                          Session.setItem('UserID', UserID);
                          Session.setItem('usrname', username);
                            var url2 = $rootScope.baseUrl+'api/SaveUserKey';
                            var postData2  =  {
                              key:key,
                              UserID:UserID
                            };
                            var configObj2 = { method: 'POST',url: url2, data: postData2};
                          $http(configObj2).then(function onFulfilled(response2) {
                              vm.meanuser.login(user);
                          }).catch( function onRejection(errorResponse2) {
                              console.log('Error: ', errorResponse2.status);
                              console.log(errorResponse2);
                          }); 
                     }
                  }
              }).catch( function onRejection(errorResponse) {
                  console.log('Error: ', errorResponse.status);
                  console.log(errorResponse);
             });

      };
    }
})();
