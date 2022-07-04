var mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;

var operatorSchema = mongoose.Schema(
    {
        username: {
            type: String,
        },
        password: {
            type: String,
        },
        type: { //类型
            type: Number,
            enum: [0, 1, 2], //0-超级管理员 1-普通管理员 2-渠道商
            default: 1
        },
        role_id: { //角色id
            type: Schema.Types.ObjectId,
        },
        create_time: {
            type: Date,
            default: Date.now
        }
    }
);

operatorSchema.methods.pswMd5 = function (password) {
    return md5(password);
};

operatorSchema.methods.validPassword = function (password) {
    return md5(password) == this.password;
};

function md5(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

module.exports = operatorSchema;
