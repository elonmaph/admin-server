var mongoose = require('mongoose');

var productSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        type: { //类型 0-vip充值 1-钻石充值
            type: Number,
            enum: [0, 1], 
            default: 0
        },
        price:{
            type:Number,
        },
        sub_title:{
            type:String
        },
        bonus:{
            type: Number, 
        },
        coins:{
            type: Number, 
        },
        channel:{ //支付通道 0-支付宝 1-微信
            type:Number,
            enum: [0, 1], 
            default: 0
        },
        valid_days:{
            type:Number,
        },
        create_time: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = productSchema;
