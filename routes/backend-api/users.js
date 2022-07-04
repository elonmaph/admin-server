var express = require('express');
var router = express.Router();
var User = require('../../schema/userModel');
var ObjectID = require('mongodb').ObjectID;

const { response, responseWithPageInfo } = require('../../src/response');

/*获取所有用户*/
router.get('/', async function (req, res, next) {
    const { pageNo, pageSize } = req.query;
    let users = await User.find({}, { __v: 0 }, { sort: { _id: -1 }, skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize) });
    let totalCount = await User.find().countDocuments();
    let totalPage = Math.ceil(totalCount / parseInt(pageSize));
    if (users) {
        res.send(responseWithPageInfo(true, users, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
    else {
        res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
});

module.exports = router;
