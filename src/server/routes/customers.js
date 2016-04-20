var express = require('express');
var router = express.Router();
var query = require('../db/customers_queries');

var stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// router.post('/stripe/customer', function(req, res, next){
//   console.log(req.body);
//   var token = req.body.token;


// })

router.get('/profile/:customer_id', function(req, res, next){
  query.getCustomer(req.params.customer_id).then(function(customer){
    res.json(customer);
  });
});

router.post('/profile', function(req, res, next){
  var token = req.body.token;
  var inserter = req.body.customer;
  stripe.customers.create({
    description: 'Customer for test@example2.com',
    source: token
  }, function(err, customer) {
    stripe.customers.createSource(
      customer.id,
      {source: token},
      function(err, card) {

        inserter.stripe_id = customer.id;
        console.log(inserter);
        query.createCustomer(inserter).then(function(data){
          res.json("Successfully inserted customer")
        })
      }
    );
  })
})

router.post('/update', function(req, res, next){
  query.updateCustomer(req.body).then(function(customer){
    res.json(customer);
  })
})



module.exports = router;
