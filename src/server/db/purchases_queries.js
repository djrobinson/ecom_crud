var knex = require('./knex');

function Purchases() {
  return knex('purchases');
}

module.exports = {
  getPurchases: function(){
    return Purchases().select();
  },
  getPurchase: function(id){
    return Purchases().where('id', id);
  },
  createPurchase: function(purchase){
    return Purchases().insert({
      'product_id': purchase.id,
      'customer_id': purchase.user_id,
      'purchase_time': new Date(),
      'mfc_id': purchase.mfc_id,
      'quantity': purchase.count
    });
  }
}