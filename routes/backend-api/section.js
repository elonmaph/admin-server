var express = require('express');
var router = express.Router();
var Section = require('../../schema/sectionModel');
var Video = require('../../schema/videoModel');
const { response, responseWithPageInfo } = require('../../src/response');
var ObjectID = require('mongodb').ObjectID;

/**
 * 游标函数
 * @param _start 游标的起始位置
 * @param _limit 游标的分页数量
 * @param _section_id 游标的分页数量
 * @param _callback 游标执行函数
 */
async function cursorBySection(_start, _limit, _section_id, _callback) {
    //初始化数据定义
    let start, limit, type;
    //初始化起始位置
    start = !_start || _start < 0 ? 0 : _start;
    //初始化分页数量
    limit = !_limit || _limit < 1 ? 1 : _limit;

    //使用Model执行分页查询
    let docs = await Video.find({ section: { $all: [_section_id] } }, { __v: 0 }, { skip: start, limit: limit });

    if (_callback) {
        _callback(docs);
    }
}

/*添加分区到指定分类*/
router.post('/', async function (req, res, next) {
    const { title, type, status, author, category, list } = req.body;

    let val = {
        title,
        type,
        _category: category,
        status
    }
    if ((type == 0 || type == 1 || type == 2 || type == 3) && author) {
        val = Object.assign({}, val, { author: ObjectID(author) });
    }
    else if ((type == 0 || type == 1 || type == 2 || type == 3) && !author) {
        return res.send(response(false));
    }
    else if ((type == 4 || type == 5 || type == 6 || type == 7) && list) {
        val = Object.assign({}, val, { list: ObjectID(list) });
    }
    else if ((type == 4 || type == 5 || type == 6 || type == 7) && !list) {
        return res.send(response(false));
    }

    const section = new Section(val);
    try {
        await section.save();
        res.send(response(true, section));
    } catch (err) {
        res.send(response(false));
    }
});

/*上架/下架分区*/
router.patch('/status', async function (req, res, next) {
    const { section_id, status } = req.body;
    try {
        await Section.findByIdAndUpdate(section_id, { $set: { status } });
        res.send(response(true));
    }
    catch (error) {
        res.send(response(false));
    }
});

/*获取所有分区*/
router.get('/', async function (req, res, next) {
    const { pageNo, pageSize } = req.query;

    var sections = await Section.find({}, { __v: 0 }, { skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize) }).populate('author', { nickname: 1, _id: 1 }).populate('_category', { title: 1, _id: 1 });
    let totalCount = await Section.find().countDocuments();
    let totalPage = Math.ceil(totalCount / parseInt(pageSize));
    if (sections) {
        res.send(responseWithPageInfo(true, sections, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
    else {
        res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
});

module.exports = router;
