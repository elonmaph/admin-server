var express = require('express');
var router = express.Router();
var Video = require('../../schema/videoModel');
var ObjectID = require('mongodb').ObjectID;

const { response, responseWithPageInfo} = require('../../src/response');

/**
 * 游标函数
 * @param _start 游标的起始位置
 * @param _limit 游标的分页数量
 * @param _callback 游标执行函数
 */
async function cursor(_start, _limit, _callback) {
    //初始化数据定义
    let start, limit, type;
    //初始化起始位置
    start = !_start || _start < 0 ? 0 : _start;
    //初始化分页数量
    limit = !_limit || _limit < 1 ? 1 : _limit;

    //使用Model执行分页查询
    let docs = await Video.find({}, { __v: 0 }, { skip: start, limit: limit });

    if (_callback) {
        _callback(docs);
    }
}

/*获取所有视频*/
router.get('/', async function (req, res, next) {
    let { pageNo, pageSize } = req.query;
    let videos = await Video.find({}, { __v: 0 }, { skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize)}).populate('author', { nickname: 1, _id: 1 });

    let totalCount = await Video.find({}).countDocuments();
    let totalPage = Math.ceil(totalCount / parseInt(pageSize));
    if (videos) {
      res.send(responseWithPageInfo(true, videos, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
    else {
      res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
});


/*作者测试数据*/
router.post('/test', async function (req, res, next) {
    let videos = await Video.find({}, { __v: 0 }, { skip: 0, limit: 50 });
    // for (let i = 0; i < videos.length; i++) {
    //     let video_id = videos[i]._id;
    //     await Video.findByIdAndUpdate(video_id, { $set: { author: "61544da7bc1d8cc348b012f3" } });
    // }

    for (let i = 0; i < 25; i++) {
        let video_id = videos[i]._id;
        await Video.findByIdAndUpdate(video_id, { $set: { type: 0 } });
    }

    for (let i = 25; i < 50; i++) {
        let video_id = videos[i]._id;
        await Video.findByIdAndUpdate(video_id, { $set: { type: 1 } });
    }

    res.send(response(true));
});

module.exports = router;
