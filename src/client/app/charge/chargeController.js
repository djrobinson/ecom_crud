angular
  .module('ecomApp')
  .controller('PaymentController', PaymentController);

PaymentController.$inject = ['$http','$window', '$localStorage', 'cartFactory','orderFactory', 'customerService'];
function PaymentController($http, $window, $localStorage, cartFactory, orderFactory, customerService) {
  var self = this;
  var cart = cartFactory.getLocalCart();
  var user = $localStorage.user;
  self.ship = {};
  self.card = {};
  self.payee = null;
  self.amount = null;

  self.decide = function(){
    if (self.checked){
      self.payOnFile();
    } else {
      self.pay();
    }
  };

  customerService.getCustomer(user)
    .success(function(data){
      if (data[0].address1 || data[0].zip){
        self.shipName = data[0].name;
        self.ship = data[0];
      }
    }).error(function(error){
      $scope.status = 'Unable to retrieve customer data ' + error.message;
    });


  self.pay = function() {
    Stripe.card.createToken(self.card, function(status, response) {
      if(status === 200) {
        var data = {
          ship: self.ship,
          onfile: self.checked,
          cart: cart,
          user: user,
          card: self.card,
          onfile: self.onfile,
          token: response.id,
          amount: self.amount,
          currency: "usd",
          payee: self.payee
        };
        //Need to break this out into more logical promises
        $http
          .post('/api/charge', data)
          .then(function(res) {
            if(res.status === 200) {
                console.log();
                $localStorage.setOrdered = true;
              $http.post('/api/safe/carts', {'user': user}).then(function(response){
                cartFactory.setLocalCart(response.data.cart);
                $window.location.href = '/';
              });
            }
            else {

              self.paymentSuccessful = $localStorage.setOrdered;
            }
          });
      }
    });
  };

  self.payOnFile = function(){
    var data = {
      ship: self.ship,
      cart: cart,
      user: user,
      amount: self.amount,
      currency: "usd",
    };
    $http
      .post('/api/charge/onfile', data)
      .then(function(res) {
        console.log("onfile Response ", res);
        if(res.status === 200) {
            console.log();
            $localStorage.setOrdered = true;
          $http.post('/api/safe/carts', {'user': user}).then(function(response){
            cartFactory.setLocalCart(response.data.cart);
            $window.location.href = '/';
          });
        } else {
          self.paymentSuccessful = $localStorage.setOrdered;
        }
      });
  };

  self.reset = function() {
    self.card = {};
    self.payee = "";
    self.amount = null;
    self.paymentSuccessful = false;
    self.Form.$setPristine(true);
    // use vanilla JS to reset form to remove browser's native autocomplete highlighting
    document.getElementsByTagName('form')[0].reset();
  };
}
