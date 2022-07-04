var mongoose = require('mongoose');

var listSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        des: {
            type: String,
        },
        pic: {
            type: String,
        },
        create_time: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = listSchema;
