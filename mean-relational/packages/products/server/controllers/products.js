'use strict';

/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');
var express = require('express');
var LocalStorage = require('node-localstorage').LocalStorage,
   localStorage = new LocalStorage('./scratch');
var cors = require('cors');
var app = express();

        //var baseUrl = 'http://localhost:3000/';
        var ip = '192.168.100.88';
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
   db.product.findAll().then(function(product){
        var productsData = [];
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
        productsData.push({'col1':col1});
        productsData.push({'col2':col2});
        productsData.push({'col3':col3});
        productsData.push({'col4':col4});
        var grp_cartId = localStorage.getItem('grp_cartId');
        if(grp_cartId !== undefined && grp_cartId !== null){
            productsData.push({'grp_cartId':grp_cartId});
            var Query = 'select a.ProdBrandId,a.name, a.cost_price, a.specs ,a.img_loc from productbrands a, group_cart_products b, grpcart_products c where a.prodbrandId=b.crt_item and b.groupCartProductId=c.groupCartProductId and c.grp_cartId = '+grp_cartId;
            productsData.push({'Query':Query});
            db.sequelize.query(Query,{raw: false}).then(grpcart_products => {
                var productIds = [];
                grpcart_products[0].forEach(function(row,index) {
                   // if(productIds.indexOf(row['grpcart_productsId']) === -1) {
                       // console.log( row );
                        productIds.push( row );
                    //}
                });
                productsData.push({'grpcart_products':productIds});
                return res.jsonp(productsData);
            }).catch(function(err){
                    productsData.push({'errors':'Sorry Error Found '+err});
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
        console.log(err);
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};


exports.createCart_guest = function(req, res) {
    var grp_cartId = localStorage.getItem('grp_cartId',grp_cartId);
    var data = {};
     console.log(grp_cartId);
    if(grp_cartId !== undefined && grp_cartId !== null){
        data.grp_cartId = grp_cartId;
        console.log(data);
        data = JSON.stringify(data);
        console.log(data);
        data = JSON.parse(data);
        console.log(data);
        return res.json(data);
    }else{

        var http = require('http');
        //var url = ApiBaseUrl+'createCart_guest/PK/';
        var body = '';
        var data = [];
        var options = {
            hostname: ip,
            port: '8080',
            path: ApiBasePath+'createCart_guest/PK/',
            method: 'GET',
            headers: headers
        };

        req = http.request(options,function(res2){

            res2.on('data', function(chunk) {
                 body += chunk;
            });

            res2.on('end', function() {
                data = JSON.parse(body); 
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
                localStorage.setItem('grp_cartId',grp_cartId);              
                return res.json(data);
            });
        });

        req.on('error', function(e){
            console.log('problem with request:'+ e.message);
        });
    }
        req.end();

};

exports.addToCart_guest = function(req, res) {
    var cartID = req.body.cartID;
    var productID = req.body.productID;

    var http = require('http');
    //var url = ApiBaseUrl+'addToCart_guest/'+productID+'/'+cartID+'/';
    var body = '';
    var data = [];
    var options = {
        hostname: ip,
        port: '8080',
        path: ApiBasePath+'addToCart_guest/'+productID+'/'+cartID+'/',
        method: 'GET',
        headers: headers
    };

    req = http.request(options,function(res2){

        res2.on('data', function(chunk) {
             body += chunk;
        });

        res2.on('end', function() { 
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
    var grp_cartId = localStorage.getItem('grp_cartId');
    return res.jsonp(grp_cartId);
};

/**
 * Get Group Cart Products
 */
/*exports.getGroupCartProducts = function(req, res) {
   
};*/


function convertJson(json){
     var prod = {};
     var main = {};
    //prod.id = json.ProdBrandId;
    prod.name = json.name;
    prod.cost_price = json.cost_price;
    prod.specs = json.specs;
    prod.img_loc = json.img_loc;
    prod.dateadded = json.dateadded;
    prod.prodBrandId = json.ProdBrandId;
    main.prod = prod;
    var jsonString= JSON.stringify(main);
    return JSON.parse(jsonString);
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