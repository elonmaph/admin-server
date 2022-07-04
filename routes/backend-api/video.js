var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Busboy = require('busboy');
var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');

var Video = require('../../schema/videoModel');
var User = require('../../schema/userModel');
var VideoCategory = require('../../schema/videoCategoryModel');
var VideoTag = require('../../schema/videoTagModel');

const { response, responseWithMsg, invaPidErr } = require('../../src/response');

const video_res_path = process.env.video_res_path;

/*获取视频的编辑信息*/
router.get('/', async function (req, res, next) {
    const { video_id } = req.query;
    try {
        let videoDoc = await Video.findById(video_id);
        if (videoDoc) {
            let { tags, categories } = videoDoc;
            let videoTags = await VideoTag.find({});
            let videoCategories = await VideoCategory.find({});

            let combTags = [];
            for (let i = 0; i < videoTags.length; i++) {
                let name = videoTags[i].name;
                if (tags.indexOf(name) != -1) {
                    combTags.push({ name, select: true });
                }
                else {
                    combTags.push({ name, select: false });
                }
            }

            let combCategories = [];
            for (let i = 0; i < videoCategories.length; i++) {
                let name = videoCategories[i].name;
                if (categories.indexOf(name) != -1) {
                    combCategories.push({ name, select: true });
                }
                else {
                    combCategories.push({ name, select: false });
                }
            }

            videoDoc._doc.tags = combTags;
            videoDoc._doc.categories = combCategories;

            res.send(response(true, videoDoc));
        }
        else {
            res.send(response(false));
        }
    } catch (error) {
        res.send(response(false));
    }
});

/*编辑视频信息*/
router.patch('/', async function (req, res, next) {
    const { video_id, title, duration, categories, models, tags, screenshot, type } = req.body;
    if (video_id) {
        var updateObj = {};
        if (title) {
            updateObj = Object.assign(updateObj, { title });
        }

        if (duration) {
            updateObj = Object.assign(updateObj, { duration });
        }

        if (screenshot) {
            updateObj = Object.assign(updateObj, { screenshot });
        }

        if (type) {
            updateObj = Object.assign(updateObj, { type: parseInt(type) });
        }

        if (categories) {
            updateObj = Object.assign(updateObj, { categories });
        }

        if (tags) {
            updateObj = Object.assign(updateObj, { tags });
        }

        if (models) {
            updateObj = Object.assign(updateObj, { models });
        }
        await Video.findByIdAndUpdate(video_id, updateObj);
        res.send(response(true));
    }
    else {
        res.send(response(false));
    }
});

/*视频图片上传*/
router.patch('/image', async function (req, res, next) {
    let video_id;
    let screenshot;
    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        let resDir = path.join(video_res_path, video_id);
        let suffix = filename.split('.').pop();
        let picName = uuidv4() + '.' + suffix;
        screenshot = '/' + video_id + '/' + picName;
        const saveTo = path.join(resDir, picName);
        file.pipe(fs.createWriteStream(saveTo));

        file.on('data', function (data) {
            console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
        });
        file.on('end', function () {
            console.log('File [' + fieldname + '] Finished');
        });
    });

    busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        if (fieldname == 'video_id') {
            video_id = val;
        }
    });

    busboy.on('finish', async function () {
        console.log('Done parsing form!');
        await Video.findByIdAndUpdate(video_id, { $set: { screenshot } });
        res.send(response(true, { screenshot }));
    });
    req.pipe(busboy);
});

/*给视频添加演员*/
router.patch('/models', async function (req, res, next) {
    const { video_id, model } = req.body;
    await Video.findByIdAndUpdate(video_id, { $push: { models: model } });
    res.send(response(true));
});

/*给视频绑定作者*/
router.patch('/author', async function (req, res, next) {
    const { video_id, platform_id } = req.body;
    let user = await User.findOne({ platform_id }, { _id: 1 });
    if (user) {
        await Video.findByIdAndUpdate(video_id, {
            $set: {
                'author._id': user._id.toString(),
                'author.nickname': user.nickname,
                'author.avatar': user.avatar,
            }
        });
        res.send(response(true));
    }
    else {
        res.send(responseWithMsg(false, invaPidErr));
    }
});

/*给表单加视频*/
router.post('/list', async function (req, res, next) {
    const { video_id, list_id } = req.body;
    await Video.findByIdAndUpdate(video_id, { $push: { list: list_id } });
    res.send(response(true));
});

/*将视频从表单删除*/
router.delete('/list', async function (req, res, next) {
    const { video_id, list_id } = req.body;
    await Video.findByIdAndUpdate(video_id, { $pull: { list: list_id } });
    res.send(response(true));
});

/*视频上下架*/
router.patch('/status', async function (req, res, next) {
    const { video_id, status } = req.body;
    await Video.findByIdAndUpdate(video_id, { $set: { status: parseInt(status) } });
    res.send(response(true));
});

/*设置视频的消费类型*/
router.patch('/paytype', async function (req, res, next) {
    const { video_id, pay_type, coin } = req.body;
    if (pay_type == 1) {
        await Video.findByIdAndUpdate(video_id, { $set: { pay_type: parseInt(pay_type), coin: parseInt(coin) } });
    }
    else {
        await Video.findByIdAndUpdate(video_id, { $set: { pay_type: parseInt(pay_type) } });
    }
    res.send(response(true));
});

module.exports = router;
