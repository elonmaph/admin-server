var mongoose = require('mongoose');
var orderSchema = require("./orderSchema");

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;
