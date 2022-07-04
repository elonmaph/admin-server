var mongoose = require('mongoose');
var listSchema = require("./listSchema");

var List = mongoose.model('List', listSchema);

module.exports = List;
