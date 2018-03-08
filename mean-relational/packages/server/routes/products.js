
'use strict';

/**
* Module dependencies.
*/
var products = require('../controllers/products');

module.exports = function(app) {
// product Routes
app.route('/api/charge').post(products.charge);
app.route('/api/products').get(products.all);

app.route('/api/getAisles').get(products.getAisles);

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

app.route('/api/getUserDetail').post(products.getUserDetail);
app.route('/api/getUserProductDetails').post(products.getUserProductDetails);
app.route('/api/getProductBuyingUsers').post(products.getProductBuyingUsers);
//get user cart detail

app.route('/api/getUserCartDetail').post(products.getUserCartDetail);
app.route('/api/addCommentToCart').post(products.addCommentToCart);

app.route('/api/suggestProd').post(products.suggestProd);
app.route('/api/acceptProdInCart').post(products.acceptProdInCart);
app.route('/api/getAisleProd').post(products.getAisleProd);

app.route('/api/getAllProdsInLocDefault_thin').post(products.getAllProdsInLocDefault_thin);
app.route('/api/getAllProdsInLocDefaultInAisle_mini').post(products.getAllProdsInLocDefaultInAisle_mini);


app.param('productId', products.product);
};