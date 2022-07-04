var express = require('express');
var router = express.Router();
var Category = require('../../schema/categoryModel');
var Section = require('../../schema/sectionModel');
var ObjectID = require('mongodb').ObjectID;

const { response, responseWithPageInfo } = require('../../src/response');

/*获取所有分类*/
router.get('/', async function (req, res, next) {
  const { position, pageNo, pageSize } = req.query;
  var categories = await Category.find({ position }, { __v: 0 }, { skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize) });
  let totalCount = await Category.find({ position }).countDocuments();

  let totalPage = Math.ceil(totalCount / parseInt(pageSize));
  if (categories) {
    res.send(responseWithPageInfo(true, categories, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
  }
  else {
    res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
  }
});

/*添加分类*/
router.post('/', async function (req, res, next) {
  const { title, position, type } = req.body;

  const category = new Category({
    title,
    position,
    type
  });
  try {
    await category.save();
    res.send(response(true, category));
  } catch (err) {
    res.send(response(false));
  }
});

/*分类上下架*/
router.patch('/status', async function (req, res, next) {
  const { category, status } = req.body;
  try {
    await Category.findByIdAndUpdate(category, { $set: { status } });
    res.send(response(true));
  }
  catch (error) {
    res.send(response(false));
  }
});

/*获取分类下的分区*/
router.get('/sections', async function (req, res, next) {
  const { category, pageNo, pageSize } = req.query;

  var sections = await Section.find({ _category: ObjectID(category) }, { __v: 0 }, { skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize) }).populate('author', { nickname: 1, _id: 1 }).populate('_category', { title: 1, _id: 1 }).populate('list', { title: 1, _id: 1 });
  let totalCount = await Section.find({ _category: ObjectID(category) }).countDocuments();
  let totalPage = Math.ceil(totalCount / parseInt(pageSize));
  if (sections) {
    res.send(responseWithPageInfo(true, sections, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
  }
  else {
    res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
  }
});

module.exports = router;
