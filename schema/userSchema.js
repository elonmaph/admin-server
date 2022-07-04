var mongoose = require('mongoose');
const crypto = require('crypto');
const { nanoid } = require('nanoid')

var userSchema = mongoose.Schema(
    {
        device_id: {
            type: String,
        },
        username: {
            type: String,
            default:''
        },
        password: {
            type: String,
        },
        phone: {
            type: String
        },
        nickname: {
            type: String
        },
        avatar: {
            type: String
        },
        describle: {
            type: String,
            default: "快来关注我吧"
        },
        group: {
            type: Number,
            enum: [0, 1, 2], //0-游客 1-原创个人 2-原创大神 3-专业工作室
            default: 0
        },
        coins: {
            type: Number,
            default: 0
        },
        vip: {
            type: Number,
            default: 0
        },
        vip_ex: {
            type: Number,
            default:0
        },
        vip_tag:{
            type:String
        },
        balance: {
            type: Number,
            default: 0
        },
        following: {
            type: Number,
            default: 0
        },
        followers: {
            type: Number,
            default: 0
        },
        inviters: {
            type: Number,
            default: 0
        },
        like_cnt:{
            type:Number,
            default:18000,
        },
        invite_by:{
            type:String,
            default:'default',
        },
        platform_id: {
            type: String,
            default: nanoid(8)
        },
        platform:{
            type:String
        },
        create_time: {
            type: Number,
        }
    }
);

userSchema.methods.pswMd5 = function (password) {
    return md5(password);
};

userSchema.methods.validPassword = function (password) {
    return md5(password) == this.password;
};

function md5(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

module.exports = userSchema;
