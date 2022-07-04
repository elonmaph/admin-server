var mongoose = require('mongoose');
var signinRecSchema = require("./signinRecSchema");

var SigninRec = mongoose.model('SigninRec', signinRecSchema);

module.exports = SigninRec;
