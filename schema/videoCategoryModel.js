var mongoose = require('mongoose');
var videoCategorySchema = require("./videoCategorySchema");

var VideoCategory = mongoose.model('VideoCategory', videoCategorySchema);

module.exports = VideoCategory;
