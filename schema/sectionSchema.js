var mongoose = require('mongoose');
const { Schema } = mongoose;

var sectionSchema = mongoose.Schema(
    {
        title: {
            type: String,
        },
        type: { //类型
            type: Number,
            //0-绑定作者 仅展示短视频 
            //1-绑定作者 仅展示长视频 footer
            //2-绑定作者 仅展示长视频五宫格  footer
            //3-绑定作者 仅展示长视频 横向滚动
            //4-绑定视频分类 仅展示短视频
            //5-绑定视频分类 仅展示长视频 footer
            //6-绑定视频分类 仅展示长视频五宫格  footer
            //7-绑定视频分类 仅展示长视频 横向滚动
            enum: [0, 1, 2, 3, 4, 5, 6, 7],
            default: 0
        },
        status: { //状态
            type: Number,
            enum: [0, 1],  //0-下线 1-上线 
            default: 0
        },
        _category: { //所属分类
            type: Schema.Types.ObjectId,
            ref: 'Category'
        },
        author: {//作者id
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        list: {//视频表单id
            type: Schema.Types.ObjectId,
            ref: 'List'
        },
        videoCategory:{//视频分类id
            type: Schema.Types.ObjectId,
        },
        create_time: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = sectionSchema;
