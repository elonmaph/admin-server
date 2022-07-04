var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;
var Busboy = require('busboy');
var inspect = require('util').inspect;
var fs = require('fs');
var path = require('path');
const { v4: uuidv4 } = require('uuid');

var Section = require('../../schema/sectionModel');
var Video = require('../../schema/videoModel');
var List = require('../../schema/listModel');
const { response, responseWithPageInfo, responseWithMsg, videoExitsinListErr } = require('../../src/response');

const video_list_pics_path = process.env.video_list_pics_path;

/*添加一个视频表单*/
router.post('/', async function (req, res, next) {
    let { title, des } = req.body;
    let list = new List({
        title,
        des
    });
    res.send(response(true, await list.save()));
});

/*给表单添加图片*/
router.post('/pic', async function (req, res, next) {
    let list_id;
    let pic;

    var busboy = new Busboy({ headers: req.headers });
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        let picsDir = path.join(video_list_pics_path, 'pics');
        if (!fs.existsSync(picsDir)) {
            fs.mkdirSync(picsDir);
        }
        let suffix = filename.split('.').pop();
        let picName = uuidv4() + '.' + suffix;
        pic = 'pics/' + picName;
        const saveTo = path.join(picsDir, picName);
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
        if (fieldname == 'list_id') {
            list_id = val;
        }
    });
    busboy.on('finish', async function () {
        console.log('Done parsing form!');
        await List.findByIdAndUpdate(list_id, { $set: { pic } });
        res.send(response(true, { pic }));
    });
    req.pipe(busboy);
});

/*获取视频表单下的视频*/
router.get('/videos', async function (req, res, next) {
    const { pageNo, pageSize, list_id } = req.query;
    var videos = await Video.find({ list: { $all: [list_id] } }, { __v: 0 }, { skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize) }).populate('author', { nickname: 1, _id: 1 });
    let totalCount = await Video.find({ list: { $all: [list_id] } }).countDocuments();
    let totalPage = Math.ceil(totalCount / parseInt(pageSize));
    if (videos) {
        res.send(responseWithPageInfo(true, videos, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
    else {
        res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
});

/*获取所有视频表单*/
router.get('/', async function (req, res, next) {
    const { pageNo, pageSize } = req.query;

    var lists = await List.find({}, { __v: 0 }, { skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize) });
    let totalCount = await List.find().countDocuments();
    let totalPage = Math.ceil(totalCount / parseInt(pageSize));
    if (lists) {
        res.send(responseWithPageInfo(true, lists, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
    else {
        res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
});

/*编辑视频表单*/
router.post('/edit', async function (req, res, next) {
    let { title, des, list } = req.body;
    await List.findByIdAndUpdate(list, { $set: { title, des } });
    res.send(response(true));
});

module.exports = router;
