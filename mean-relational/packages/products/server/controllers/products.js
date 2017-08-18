'use strict';

/**
 * Module dependencies.
 */
var db = require('../../../../config/sequelize');

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
    db.product.findAll().then(function(products){
        return res.jsonp(products);
    }).catch(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

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
