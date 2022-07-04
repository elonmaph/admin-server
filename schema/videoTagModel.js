var mongoose = require('mongoose');
var videoTagSchema = require("./videoTagSchema");

var VideoTag = mongoose.model('VideoTag', videoTagSchema);

module.exports = VideoTag;
