var mongoose = require('mongoose');
const { Schema } = mongoose;

var signinRecSchema = mongoose.Schema(
    {
        user: {
            type: String,
        },
        type:{
            type: Number,
            enum: [0, 1], //0-新增 1-老用户
            default: 0
        },
        create_time: {
            type: Number,
        }
    }
);

module.exports = signinRecSchema;
