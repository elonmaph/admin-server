var express = require('express');
var router = express.Router();
var User = require('../../schema/userModel');
var SigninRec = require('../../schema/signinRecModel');
var Order = require('../../schema/orderModel');

const { response, responseWithPageInfo } = require('../../src/response');
var ObjectID = require('mongodb').ObjectID;

/*查询总注册用户*/
router.get('/users', async function (req, res, next) {
    const { start, end } = req.query;
    let usersCnt = await User.find({ create_time: { $gte: parseInt(start), $lte: parseInt(end) } }).countDocuments();
    res.send(response(true, { usersCnt }));
});

/*查询活跃用户*/
router.get('/activeUsers', async function (req, res, next) {
    const { start, end } = req.query;
    let signinRecs = await SigninRec.distinct('user', { create_time: { $gte: parseInt(start), $lte: parseInt(end) } });
    res.send(response(true, { activeUsers: signinRecs.length }));
});

/*VIP会员充值金额*/
router.get('/vipRecs', async function (req, res, next) {
    const { start, end } = req.query;
    let orders = await Order.find({ create_time: { $gte: parseInt(start), $lte: parseInt(end) }, status: 1, type: 0 });
    let price = 0;
    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        price += order.price;
    }
    res.send(response(true, { totalAmount: price }));
});

/*钻石充值金额*/
router.get('/coinsRecs', async function (req, res, next) {
    const { start, end } = req.query;
    let orders = await Order.find({ create_time: { $gte: parseInt(start), $lte: parseInt(end) }, status: 1, type: 1 });
    let price = 0;
    for (let i = 0; i < orders.length; i++) {
        let order = orders[i];
        price += order.price;
    }
    res.send(response(true, { totalAmount: price }));
});


/*获取留存统计*/
router.get('/remainStatistics', async function (req, res, next) {
    const { start_date, type } = req.query;

    let start_time = start_date + " 00:00:00";
    let start_time_stamp = (new Date(start_time)).valueOf();
    let now_time_stamp = (new Date()).valueOf();

    let gap_days = Math.floor(((now_time_stamp - start_time_stamp) / (1000 * 3600 * 24)));

    //显示7天
    let lists = [], abs_interval_days = 0, interval_days = 0, before_stamp = 0, days = 0, st_day = '', first_day_date = '';
    for (let i = 0; i < 3; i++) {
        abs_interval_days = Math.abs(-gap_days - i);
        interval_days = -gap_days - i;
        before_stamp = now_time_stamp - abs_interval_days * 1000 * 60 * 60 * 24;//当前日期时间戳减去一天时间戳
        first_day_date = getDate(new Date(before_stamp)); //获取一个时间对象

        days = 0;
        st_day = '';
        let remain_ids = [], temp = [];
        for (let k = 0; k <= 7; k++) {
            days = interval_days + k;
            st_day = k + "st_day"

            if (k == 0) {
                let remain_res = await dayRemain(days, type, true);
                temp.push({ st_day: st_day, day_remain_count: remain_res['day_remain_count'] })
                remain_ids = remain_res['remain_ids'];
            } else {
                let remain_res = await dayRemain(days, type, false, remain_ids);
                temp.push({ st_day: st_day, day_remain_count: remain_res['day_remain_count'] })
            }
        }
        lists.push({ first_day_date: first_day_date, remain_date: temp })
    }

    res.send(response(true, { lists: lists }));
});

async function dayRemain(days, type = 1, is_first = false, first_day_member_ids = []) {
    let now_time_stamp = (new Date()).valueOf();
    let time_stamp = now_time_stamp + days * 1000 * 60 * 60 * 24;
    let day_date = getDate(new Date(time_stamp));

    let start_date = day_date + " 00:00:00";
    let end_date = day_date + " 23:59:59";

    let start_time = Math.floor((new Date(start_date)).valueOf() / 1000);
    let end_time = Math.floor((new Date(end_date)).valueOf() / 1000);

    let total_count = first_day_member_ids.length;

    let remain_ids = [], day_remain_count = 0;
    if (!is_first) {
        let member_ids = Array.from(first_day_member_ids, ({ user }) => user);
        // console.log('>>>>>>start 1>>',Math.floor(Date.now()));
        let signinRecs = await SigninRec.distinct('user', { create_time: { $gte: parseInt(start_time), $lte: parseInt(end_time) }, user: { $in: member_ids }, type: 1 });
        // console.log('>>>>>>end 1>>',Math.floor(Date.now()));
        day_remain_count = signinRecs.length

        if (type == 2) {
            if (total_count == 0) {
                day_remain_count = "0%";
            } else {
                let rate = (day_remain_count / total_count).toFixed(2);
                day_remain_count = (rate * 100) + "%";
            }
        }
    } else {
        // console.log('>>>>>>start 2>>',Math.floor(Date.now()));
        remain_ids = await SigninRec.find({ create_time: { $gte: parseInt(start_time), $lte: parseInt(end_time) }, type: 0 }, { user: 1, _id: 0 })
        // console.log('>>>>>>end 2>>',Math.floor(Date.now()));
        day_remain_count = remain_ids.length;
    }

    let result = [];
    result['remain_ids'] = remain_ids;
    result['day_remain_count'] = day_remain_count;

    return result;
}

function getDate(time_stamp) {
    var date = new Date(time_stamp);
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate();

    return Y + M + D
}

module.exports = router;
