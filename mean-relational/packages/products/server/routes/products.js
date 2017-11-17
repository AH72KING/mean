
'use strict';

/**
* Module dependencies.
*/
//var users = require('../../../users/server/controllers/users');
var products = require('../controllers/products');

module.exports = function(app) {
// product Routes
app.route('/api/charge').post(products.charge);
app.route('/api/products').get(products.all);

app.get('/api/createCart', products.createCart);

app.route('/api/addToCart').post(products.addToCart);
app.route('/api/addUserToCart').post(products.addUserToCart);
app.route('/api/removeUserFromCart').post(products.removeUserFromCart);

app.route('/api/nl_removefromCart').post(products.nl_removefromCart);
app.route('/api/myfriends').post(products.myfriends);


/*app.route('/api/products')
    .get(products.getGroupCart);*/
    //.post(users.requiresLogin, products.create);
app.route('/api/products/:productId')
    .get(products.show);
    //.put(users.requiresLogin, products.hasAuthorization, products.update)
    //.delete(users.requiresLogin, products.hasAuthorization, products.destroy);

// Finish with setting up the productId param
// Note: the products.product function will be called everytime then it will call the next function.
app.param('productId', products.product);

app.route('/api/getUserDetail').post(products.getUserDetail);
app.route('/api/getUserProductDetails').post(products.getUserProductDetails);
app.route('/api/getProductBuyingUsers').post(products.getProductBuyingUsers);
//get user cart detail

app.route('/api/getUserCartDetail').post(products.getUserCartDetail);

};