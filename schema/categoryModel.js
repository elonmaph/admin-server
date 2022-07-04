var mongoose = require('mongoose');
var categorySchema = require("./categorySchema");

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;
