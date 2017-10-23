
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

app.get('/api/createCart_guest', products.createCart_guest);

app.route('/api/addToCart_guest').post(products.addToCart_guest);

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



};
