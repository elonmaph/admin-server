var mongoose = require('mongoose');
var sectionSchema = require("./sectionSchema");

var Section = mongoose.model('Section', sectionSchema);

module.exports = Section;
