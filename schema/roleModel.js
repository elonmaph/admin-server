var mongoose = require('mongoose');
var roleSchema = require("./roleSchema");

var Role = mongoose.model('Role', roleSchema);

module.exports = Role;
