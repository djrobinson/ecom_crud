var express = require('express');
var router  = express.Router();
var query   = require('../db/product_queries');
var stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);


var prodQueries = require('../db/product_queries');
var manuQueries = require('../db/manufacturers_queries');

router.get('/asdf', function(req, res, next) {
  prodQueries.getProducts().then(function(products){
      // res.render('index', { products: products, message: req.flash('info') });
      res.json(products);
  });
});

// router.get('/login', function(req, res, next){
//   res.render('customerLogin');
// });

// router.get('/cart', function(req, res, next){
//   res.render('shoppingCart');
// });

router.get('/products', function(req, res, next){
	query.getProducts().then(function(products){
  // res.render('products', { products: products });
  res.json(products);
  });
});

router.post('/checkout', function(req, res, next){
  var cart = req.body;
  var total = 0;
  cart.forEach(function(item){
    total += item.price;
  });
});

// router.get('/checkout', function(req, res, next){
//   res.render('checkout');
// });

router.post('/charge', function(req, res,next) {
  var stripeToken = req.body.stripeToken;
  var amount = req.body.price * 100;

  // ensure amount === actual product amount to avoid fraud

  stripe.charges.create({
    card: stripeToken,
    currency: 'usd',
    amount: amount
  },
  function(err, charge) {
    if (err) {
      console.log(err);
      res.send('error');
    } else {
      // req.flash('info', 'You bought some stuff!')
      res.redirect('/');
    }
  });
});

module.exports = router;
