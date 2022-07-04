var mongoose = require('mongoose');

var orderSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        user_id: {
            type: String,
        },
        status: { //支付状态 -1 - 支付失败 0-创建 1-已支付 
            type: Number,
            enum: [-1, 0, 1],
            default: 0
        },
        product_id:{
            type:String
        },
        type: { //类型 0-vip充值 1-钻石充值
            type: Number,
            enum: [0, 1],
            default: 0
        },
        price: {
            type: Number,
        },
        order_id: {
            type: String
        },
        channel: { //支付通道 0-支付宝 1-微信
            type: Number,
            enum: [0, 1],
            default: 0
        },
        create_time: {
            type: Number,
        }
    }
);

module.exports = orderSchema;
