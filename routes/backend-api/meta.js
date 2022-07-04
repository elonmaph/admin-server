var express = require('express');
var router = express.Router();
const { response, responseWithMsg, videoCategoryExitsErr, videoTagExitsErr } = require('../../src/response');
var VideoCategory = require('../../schema/videoCategoryModel');
var VideoTag = require('../../schema/videoTagModel');

/*
增加一个视频的分类信息
*/
router.post('/videoCategory', async function (req, res, next) {
    const { name } = req.body;

    var rec = await VideoCategory.findOne({ name });
    if (rec) {
        res.send(responseWithMsg(false, videoCategoryExitsErr));
    }
    else {
        let vc = new VideoCategory({
            name
        });
        res.send(response(true, await vc.save()));
    }
});

/*
增加一个视频的标签信息
*/
router.post('/videoTag', async function (req, res, next) {
    const { name } = req.body;

    var rec = await VideoTag.findOne({ name });
    if (rec) {
        res.send(responseWithMsg(false, videoTagExitsErr));
    }
    else {
        let vc = new VideoTag({
            name
        });
        res.send(response(true, await vc.save()));
    }
});

module.exports = router;
