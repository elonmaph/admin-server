var mongoose = require('mongoose');

var videoCategorySchema = mongoose.Schema(
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

module.exports = videoCategorySchema;
