'use strict';

/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var express = require('express');
var http = require('http');
var LocalStorage = require('node-localstorage').LocalStorage,
   localStorage = new LocalStorage('./scratch');
var cors = require('cors');
var app = express();

const keyPublishable  = 'pk_test_sZay0UdHi8gZBfIRtvWefcLy';
const keySecret       = 'sk_test_ta2435vzjD2vjo0eIP9gMPQk';

const stripe = require('stripe')(keySecret);
const bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


        //var baseUrl = 'http://localhost:3000/';
        var ip = db.sequelize.config.host;
        console.log('db.ip');
        console.log(db.sequelize.config.host);
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
 
    app.use(cors());
 
    app.all('/*', function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'X-Requested-With');
      res.header('Access-Control-Allow-Methods', 'GET, POST,PUT');
      next();

    });


/**
 * Main Index Controller Functions
 */
/*exports.Index = function(req, res){
    var returnData = [];
    returnData.data = req.all(req,res);
    returnData.cart = getGroupCart(req,res);

    return res.jsonp(returnData);

};*/


/**
 * Find product by id
 * Note: This is called every time that the parameter :productId is used in a URL.
 * Its purpose is to preload the product on the req object then call the next function.
 */
exports.product = function(req, res, next, id) {
    console.log('ProdBrandId => '+ id);
    db.product.find({ where: {ProdBrandId: id}}).then(function(product){
        if(!product) {
            return next(new Error('Failed to load product ' + id));
        } else {
            req.product = product;
            return next();
        }
    }).catch(function(err){
        return next(err);
    });
};

/**
 * Create a product
 */
exports.create = function(req, res) {
    // augment the product by adding the UserId
    //req.body.user_id = req.user.id;
    // save and return and instance of product on the res object.
    db.product.create(req.body).then(function(product){
        if(!product){
            var err = [];
            return res.status(500).send({err: err});
        } else {
            return res.json(product);
        }
    }).catch(function(err){
        return res.send({
            errors: err,
            status: 500
        });
    });
};

/**
 * Update a product
 */
exports.update = function(req, res) {

    // create a new variable to hold the product that was placed on the req object.
    var product = req.product;

    product.updateAttributes({
        title: req.body.title,
        content: req.body.content
    }).then(function(a){
        return res.jsonp(a);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Delete an product
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the product that was placed on the req object.
    var product = req.product;

    product.destroy().then(function(){
        return res.jsonp(product);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

/**
 * Show an product
 */
exports.show = function(req, res) {
    // Sending down the product that was just preloaded by the products.product function
    // and saves product on the req object.
    return res.jsonp(req.product);
};

/**
 * List of products
 */
exports.all = function(req, res) {
    var grp_cartId = 0;
    var user_id = 0;
    if (req.user) {
        // logged in
        user_id = req.user.USERID;
        grp_cartId =  localStorage.getItem('grp_cartId_'+user_id);
    } else {
        //not logged in
        grp_cartId =  localStorage.getItem('grp_cartId');
    }

    //db.product.findAll().then(function(product){
   db.product.findAll({limit: 12, 
      where: {
        status : 'A'
      }
    }).then(function(product){
        var productsData = {};
        var col1 = [];
        var col2 = [];
        var col3 = [];
        var col4 = [];
        var counter = 0;
             for(var i = 0, len = product.length; i < len; i++) {
                counter++;
                if(counter === 1){
                 var col1Json = convertJson(product[i]);
                  col1.push(col1Json);
                }
                if(counter === 2){
                  var col2Json = convertJson(product[i]);
                  col2.push(col2Json);
                }
                if(counter === 3){
                  var col3Json = convertJson(product[i]);
                  col3.push(col3Json);
                }
                if(counter === 4){
                 var col4Json = convertJson(product[i]);
                  col4.push(col4Json);
                  counter = 0;
                }
                
            }

        productsData['col1'] = col1;
        productsData['col2'] = col2;
        productsData['col3'] = col3;
        productsData['col4'] = col4;

       db.User.find({where: {USERID: user_id}, include: [db.Grpcart]}).then(function(user){
          if(!user){

            //console.log('Failed to Get Group Cart ID for user  ' + user_id);
            productsData['Failed to Get Group Cart ID for user'] = user_id;
          }else{

             //console.log(user);
            productsData['user'] = user; 
            productsData['user_id'] = user.USERID;
            console.log(user.Grpcart);
            //productsData['grp_cartId'] = user.Grpcart.user_id;
            //productsData['grp_cartId'] = user.Grpcart.user_id;
            
            //grp_cartId = user.Grpcart.user_id;

          }


        if(grp_cartId !== undefined && grp_cartId !== null){

            productsData['user_id'] = user_id;
            productsData['grp_cartId'] = grp_cartId;

            var Query =  'SELECT a.ProdBrandId,a.name, a.cost_price, a.buy_now_price, a.specs, a.img_loc, b.groupCartProductId ';
                Query += 'FROM productbrands a, group_cart_products b, grpcart_products c ';
                Query += 'WHERE a.prodbrandId = b.crt_item ';
                Query += 'AND b.groupCartProductId = c.groupCartProductId ';
                Query += 'AND c.grp_cartId = '+grp_cartId+' ';
                Query += 'ORDER BY b.actiontime DESC';

            //productsData['Query'] = Query;
            //
            db.sequelize.query(Query,{raw: false}).then(grpcart_products => {
                var productRow = {};
                //productsData['productRow']= typeof productRow;
                var TotalCartPrice = 0;
                   grpcart_products[0].forEach(function(row) {
                         
                           if (row['ProdBrandId'] in productRow){

                                var $key = row['ProdBrandId'];
                                var $oldRow = productRow[$key];
                               row['qunatity'] = 1 + $oldRow['qunatity'];
                               row['groupCartProductId'] = row['groupCartProductId'];//+','+$oldRow['groupCartProductId'];

                               productRow[$key] = row;

                           }else{

                                //productRow[row['groupCartProductId']] = row;
                                productRow[row['ProdBrandId']] = row;
                                row['qunatity'] = 1;
                                row['groupCartProductId'] = row['groupCartProductId'];

                                //productRow.push( row );

                           }
                            //TotalCartPrice  = TotalCartPrice + row['cost_price'];
                            TotalCartPrice  = TotalCartPrice + row['buy_now_price'];
                    });
                productsData['TotalCartPrice']= TotalCartPrice;
                productsData['products_cart']= productRow;
                productsData['grpcart_products'] = grpcart_products[0];

                var itemsInCart = grpcart_products[0].length;
                productsData['itemsInCart'] = itemsInCart;
                return res.jsonp(productsData);

            }).catch(function(err){
                    productsData['errors'] = 'Sorry Error Found '+err;
                    return res.jsonp(productsData);
            });
            
            /*db.grp_cart.find({ where: {grp_cartId: grp_cartId}}).then(function(grp_cart){
                if(!grp_cart) {
                    productsData.push({'errors':'Sorry No Cart Found '+grp_cartId});
                } else {
                   productsData.push({'cartData':grp_cart});
                }
            }).catch(function(err){
                    productsData.push({'errors':'Sorry Error Found '+err});
            });*/
        }else{
            return res.jsonp(productsData);
        }
      }).catch(function(err){
            console.log('error');
            console.log(err);
      });
    }).catch(function(err){
        console.log(err);
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};


exports.createCart = function(req, res) {
    var RequestUser = req.user;
    var grp_cartId = null;
    var user_id = 0;
    if (RequestUser) {
        // logged in
        user_id = RequestUser.USERID;
        grp_cartId =  localStorage.getItem('grp_cartId_'+user_id);
    } else {
        //not logged in
        grp_cartId =  localStorage.getItem('grp_cartId');
    }
    var data = {};
    if(grp_cartId !== undefined && grp_cartId !== null){
        console.log('!== undefined');
        data.grp_cartId = grp_cartId;
        data = JSON.stringify(data);
        data = JSON.parse(data);
        return res.json(data);

    }else{
          var body = '';
          data = [];
          var url = '';
          var key = '';
        if (RequestUser) {

          console.log('!== key');
          key = localStorage.getItem('key_'+user_id); 
          url = ApiBasePath+'createCart/'+key+'/';
          console.log(ApiBasePath+'createCart/'+key+'/');

        }else{
          
            url = ApiBasePath+'createCart_guest/PK/';
        }

        var options = {
              hostname: ip,
              port: '8080',
              path: url,
              method: 'GET',
              headers: headers
          };

        req = http.request(options,function(res2){

            res2.on('data', function(chunk) {
                 body += chunk;
            });

            res2.on('end', function() {
           
              console.log(body);
                data = JSON.parse(body); 
                console.log(data);
                              /*var cart_items     = data.cart_items;
                              var cartUsers      = data.cartUsers;
                              var cart_chats     = data.cart_chats;
                              var cart_events    = data.cart_events;*/
                              var grp_cartId     = data.grp_cartId;
                              /*var count          = data.count;
                              var status         = data.status;
                              var privacy        = data.privacy;
                              var owner_username = data.owner_username;
                              var owner_userId   = data.owner_userId;
                              var member_count   = data.member_count;
                              var createtime     = data.createtime;
                              var current_total  = data.current_total;
                              var currency       = data.currency;*/
                if (RequestUser) {
                  localStorage.setItem('grp_cartId_'+user_id,grp_cartId);   
                }else{
                  localStorage.setItem('grp_cartId',grp_cartId);   
                }           
                return res.json(data);
            });
        });

        req.on('error', function(e){
            console.log('problem with request:'+ e.message);
        });
    }
        req.end();

};

exports.addToCart = function(req, res) {
    var cartID    = req.body.cartID;
    var productID = req.body.productID;

    
    var url = '';
    //addToCart_guest_thin
    var body = '';
    var data = [];

      var key = '';
      var user_id = 0;
        if (req.user) {
          user_id = req.user.USERID;
          key = localStorage.getItem('key_'+user_id); 
          url = ApiBasePath+'addToCart_thin/'+key+'/'+productID+'/'+cartID+'/';
        }else{
          url = ApiBasePath+'addToCart_guest_thin/'+productID+'/'+cartID+'/';
        }
    var options = {
        hostname: ip,
        port: '8080',
        path: url,
        method: 'GET',
        headers: headers
    };

    req = http.request(options,function(res2){

        res2.on('data', function(chunk) {
             body += chunk;
        });

        res2.on('end', function() { 
            console.log(body);
           // data = JSON.stringify(body);
            data = JSON.parse(body);  
            return res.jsonp(data);
        });
    });

    req.on('error', function(e){
        console.log('problem with request:'+ e.message);
    });

    req.end();
};


/**
 * Get Group Cart
 */
exports.getGroupCart = function(req, res) {
   var grp_cartId = 0;
    if (req.user) {
         var user_id = req.user.USERID;
         grp_cartId = localStorage.getItem('grp_cartId_'+user_id);
    }else{
         grp_cartId = localStorage.getItem('grp_cartId');
    }
    
    return res.jsonp(grp_cartId);
};

/**
 * Remove Cart Item
 */
exports.nl_removefromCart = function(req, res) {
    var cartID = req.body.cartID;
    var productID = req.body.productID;
    console.log(cartID+'__'+productID);
     //return res.jsonp(cartID+'__'+productID);
    //var url = ApiBaseUrl+'nl_removefromCart/'+cartID+'/'+productID+'/';
    var body = '';
    var data = [];
    var options = {
        hostname: ip,
        port: '8080',
        path: ApiBasePath+'nl_removefromCart/'+cartID+'/'+productID+'/',
        method: 'GET',
        headers: headers
    };
    console.log(ApiBasePath+'nl_removefromCart/'+cartID+'/'+productID+'/');
    req = http.request(options,function(res2){

        res2.on('data', function(chunk) {
             body += chunk;
        });

        res2.on('end', function() { 
           // console.log(body);
            //data = JSON.stringify(body);
           // console.log(data);
            data = JSON.parse(body);  
            //console.log(body);
            return res.jsonp(data);
        });
    });

    req.on('error', function(e){
        console.log('problem with request:'+ e.message);
    });

    req.end();
};
/**
 * Do Charge
 */
exports.charge =  function(req, res){
   // return res.jsonp('I Am Here');

   var token = req.body.TokenId; // Using Express
   var amount = req.body.Amount;
    // Charge the user's card:
    stripe.charges.create({
      amount: amount,
      currency: 'usd',
      description: 'Anerve Shop Friends Shopping Platform',
      source: token,
    }, function(err, charge) {
        console.log(charge);
        console.log(err);
         return res.jsonp(charge);
    });


  /*var amount = req.body.Amount;
  
      stripe.customers.create({
        email: req.body.Email,
        card: req.body.CardID
      })
      .then(customer =>
        stripe.charges.create({
          name: 'Anerve Shop',      
          amount:amount,
          description: "Anerve Shop Friends Shopping Platform",
          currency: "usd",
          customer: customer.id
        }))
      .then(charge => res.send(charge))
      .catch(err => {
        console.log("Error:", err);
        console.log(err);
        res.status(500).send({error: err});
      });*/
};

/**
 * My Friends
 *
 * This function will return the friends for currently LoggedIn User.
 */
exports.myfriends =  function(req, res){
    var key = req.body.key;
    var body = '';
    var data = [];
    var options = {
        hostname: ip,
        port: '8080',
        path: ApiBasePath+'myfriends/'+key+'/',
        method: 'GET',
        headers: headers
    };
    req = http.request(options,function(res2){
        res2.on('data', function(chunk) {
             body += chunk;
        });
        res2.on('end', function() { 
          data = JSON.stringify(body);
          data = JSON.parse(body);  
          return res.jsonp(data);
        });
    });

    req.on('error', function(e){
        console.log('problem with request:'+ e.message);
    });

    req.end();

};

exports.getProductBuyingUsers = function(req, res){
    var productId = req.body.productId;
    var grpCartData = {};
    var Query = 'SELECT DISTINCT max(a.grp_cartId) as grp_cartId , u.USERID, u.GIVNAME, u.SURNAME, u.user_img, u.img_loc, u.img_loc1, u.img_loc2 ';
    Query += 'FROM groupcart a ';
    Query += 'INNER JOIN group_cart_products b on a.grp_cartId = b.grp_cartId ';
    Query += 'INNER JOIN users u on u.USERID = b.crt_addedby_user ';
    Query += 'where b.crt_item = '+productId+' AND a.STATUS IN ("I","A") ';
    Query += 'GROUP BY (u.USERID) ';
    Query += 'ORDER BY a.grp_cartId DESC';
    grpCartData['Query'] = Query;
    //var TotalCartPrice = 0 ;
            db.sequelize.query(Query,{raw: false}).then(grpCartDataResponse => {
                grpCartData['grpCartDataResponse']= grpCartDataResponse[0];
                return res.jsonp(grpCartData);
            });

};

exports.getUserDetail = function(req, res){
    var USERID     = req.body.USERID;
    var grp_cartId = null;
    if(req.body.grp_cartId != null && req.body.grp_cartId != undefined){
	    grp_cartId = req.body.grp_cartId;
	}

    var Query = 'SELECT u.USERID, u.GIVNAME, u.SURNAME, u.user_img, u.img_loc, u.img_loc1, u.img_loc2 ';
    Query += 'FROM users u ';
    Query += 'WHERE u.USERID = '+USERID;

            db.sequelize.query(Query,{raw: false}).then(grpCartDataResponse => {
                return res.jsonp(grpCartDataResponse[0][0]);
            });

};
exports.getUserProductDetails = function(req, res){
    var USERID     = req.body.USERID;
    var grp_cartId = null;
    if(req.body.grp_cartId != null && req.body.grp_cartId != undefined){
	    grp_cartId = req.body.grp_cartId;
	}

    var Query = 'SELECT p.ProdBrandId, p.name, p.cost_price, p.currency, p.specs, p.location, p.img_loc, p.img1, ';
    Query += 'p.short_name, p.brand_name, p.brand_logo';
    Query += ',b.groupCartProductId, b.crt_item ';
    Query += 'FROM groupcart a ';
    Query += 'INNER JOIN group_cart_products b on a.grp_cartId = b.grp_cartId ';
    Query += 'INNER JOIN productbrands p on b.crt_item = p.ProdBrandId ';
    Query += 'INNER JOIN users u on u.USERID = b.crt_addedby_user ';
    if(req.body.grp_cartId != null && req.body.grp_cartId != undefined){
	    Query += 'where b.crt_addedby_user = '+USERID+' AND a.grp_cartId = '+grp_cartId+' AND a.STATUS IN ("I","A") ';
	    Query += 'ORDER BY a.grp_cartId DESC';
	}else{
	    Query += 'where b.crt_addedby_user = '+USERID+' AND a.STATUS IN ("I","A") ';
	}

            db.sequelize.query(Query,{raw: false}).then(grpCartDataResponse => {
                return res.jsonp(grpCartDataResponse[0]);
            });

};




/*SELECT u.USERID, u.GIVNAME ,b.groupCartProductId, b.crt_item 
FROM groupcart a 
INNER JOIN group_cart_products b on a.grp_cartId = b.grp_cartId 
INNER JOIN users u on u.USERID = b.crt_addedby_user 
where b.crt_addedby_user = 84  
AND a.STATUS IN ("I","A")  
AND a.grp_cartId = 877
ORDER BY a.grp_cartId DESC*/
/**
 * Get Group Cart Products
 */
/*exports.getGroupCartProducts = function(req, res) {
   
};*/


function convertJson(json){
     /*var prod = {};
     var main = {};
    //prod.id = json.ProdBrandId;
    prod.name = json.name;
    prod.cost_price = json.cost_price;
    prod.specs = json.specs;
    prod.img_loc = json.img_loc;
    prod.dateadded = json.dateadded;
    prod.ProdBrandId = json.ProdBrandId;
    main.prod = prod;
    var jsonString= JSON.stringify(main);*/
   // return JSON.parse(jsonString);
   return json;
}

/**
 * product authorizations routing middleware
 */
 /*
exports.hasAuthorization = function(req, res, next) {
    if (req.product.User.id !== req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
};*/