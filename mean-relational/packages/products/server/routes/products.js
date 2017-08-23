
'use strict';

/**
* Module dependencies.
*/
//var users = require('../../../users/server/controllers/users');
var products = require('../controllers/products');


module.exports = function(app) {
// product Routes
app.route('/api/products')
    .get(products.all);
    //.post(users.requiresLogin, products.create);
app.route('/api/products/:productId')
    .get(products.show);
    //.put(users.requiresLogin, products.hasAuthorization, products.update)
    //.delete(users.requiresLogin, products.hasAuthorization, products.destroy);

// Finish with setting up the productId param
// Note: the products.product function will be called everytime then it will call the next function.
app.param('productId', products.product);
};
