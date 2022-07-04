var mongoose = require('mongoose');
var productSchema = require("./productSchema");

var Product = mongoose.model('Product', productSchema);

module.exports = Product;
