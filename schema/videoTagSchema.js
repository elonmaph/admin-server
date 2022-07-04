var mongoose = require('mongoose');

var videoTagSchema = mongoose.Schema(
    {
        name: {
            type: String,
        },
        create_time: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = videoTagSchema;
