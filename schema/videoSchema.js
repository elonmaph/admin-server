var mongoose = require('mongoose');
const { Schema } = mongoose;

var videoSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        duration: {
            type: String,
        },
        categories: {
            type: Array,
            default: []
        },
        tags: {
            type: Array,
            default: []
        },
        models: {
            type: Array,
            default: []
        },
        preview: {
            type: String,
        },
        screenshot: {
            type: String,
        },
        screenshot_thumb: {
            type: String,
        },
        uri: {
            type: String,
        },
        video: {
            type: String,
        },
        type: {
            type: Number,
            enum: [0, 1], //0-短视频 1-长视频
            default: 1
        },
        section: {
            type: Array,
            default: []
        },
        list: { //视频表单
            type: Array,
            default: []
        },
        author: {
            _id: { type: String },
            avatar: { type: String },
            nickname: { type: String },
        },
        pay_type: {
            type: Number,
            enum: [0, 1, 2], //0-免费 1-金币购买 2-vip
            default: 2
        },
        coin: {
            type: Number,
            default: 0
        },
        status: {
            type: Number,
            enum: [0, 1], //0-下架 1-上架
            default: 0
        },
        origin: {
            type: Number,
            enum: [0, 1, 2], //0-平台上传 1-爬虫上传 2-第三方上传
            default: 0
        },
        list:{ //视频表单
            type: Array,
            default: []
        },
        create_time: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = videoSchema;
