var mongoose = require('mongoose');
var userSchema = require("./userSchema");

var User = mongoose.model('User', userSchema);

module.exports = User;
