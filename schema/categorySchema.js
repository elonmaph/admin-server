var mongoose = require('mongoose');

var categorySchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        position: { // 位置
            type: Number,
            enum: [0, 1], //0-首页 1-会员
            default: 0
        },
        type: { //类型
            type: Number,
            enum: [0, 1, 2, 3, 4], 
            default: 0
        },
        status: { //状态
            type: Number,
            enum: [0, 1],  //0-下线 1-上线 
            default: 0
        },
        create_time: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = categorySchema;
