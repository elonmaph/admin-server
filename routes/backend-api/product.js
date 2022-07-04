var express = require('express');
var router = express.Router();
var Product = require('../../schema/productModel');
var ObjectID = require('mongodb').ObjectID;

const { response } = require('../../src/response');

/*创建产品*/
router.post('/', async function (req, res, next) {
    const { title, type, price, sub_title, bonus, channel, valid_days, coins } = req.body;
    if (type == 0)
    {
        let product = new Product({
            title,
            type: parseInt(type),
            price: parseInt(price),
            sub_title,
            bonus: parseInt(bonus),
            channel: parseInt(channel),
            valid_days: parseInt(valid_days)
        });
        await product.save();
        res.send(response(true));
    }
    else
    {
        let product = new Product({
            title,
            type: parseInt(type),
            price: parseInt(price),
            sub_title,
            bonus: parseInt(bonus),
            channel: parseInt(channel),
            coins: parseInt(coins)
        });
        await product.save();
        res.send(response(true));
    }
});

/*获取产品列表*/
router.get('/', async function (req, res, next) {
    const { type } = req.query;
    let products = await Product.find({ type: parseInt(type) });
    res.send(response(true, products));
});

module.exports = router;
