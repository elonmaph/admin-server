var mongoose = require('mongoose');
var operatorSchema = require("./operatorSchema");

var Operator = mongoose.model('Operator', operatorSchema);

module.exports = Operator;
