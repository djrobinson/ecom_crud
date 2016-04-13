var express = require('express');
var router = express.Router();

var stripe = require('stripe')("sk_test_M68Y8QkeAR5Q7wHo6GITOKqZ");

var query = require('../db/purchases_queries.js');
var cart = require('../db/shopping_cart_queries.js')


router.post("/", function(req, res) {
  var token = req.body.token;
  cart.getCheckout(req.body.cart).then(function(data){
    console.log(data);
    total = data.reduce(function(prev, curr){
      return prev + parseFloat(curr.price);
    }, 0)
    console.log("Total: ", total);
    var charge = stripe.charges.create({
      amount: parseInt(parseFloat(total * 100), 10),
      source: token,
      currency: "usd",
      description: 'TEST'
    }, function(err, charge) {
      if(err) {
        return res.json({ message: err })
      }
      res.status(200).json({ message: "Payment successful" });
    });
  })

});


module.exports = router;
