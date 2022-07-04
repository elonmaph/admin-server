var mongoose = require('mongoose');
var videoSchema = require("./videoSchema");

var Video = mongoose.model('Video', videoSchema);

module.exports = Video;
