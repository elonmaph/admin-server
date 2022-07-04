var express = require('express');
var router = express.Router();
var User = require('../../schema/userModel');
const Operator = require('../../schema/operatorModel');
var Role = require('../../schema/roleModel');
var ObjectID = require('mongodb').ObjectID;

var nav = require('../../config/menu');

const { response, responseWithPageInfo } = require('../../src/response');
const crypto = require('crypto');

function md5(password) {
    return crypto.createHash('md5').update(password).digest('hex');
}

/* 获取用户信息 */
router.get('/', async function (req, res, next) {
    let { user_id } = req.query;
    if (user_id) {
        var user = await User.findOne({ _id: ObjectID(user_id) }, { __v: 0 });
        if (user) {
            res.send(response(true, user));
        }
        else {
            res.send(response(false));
        }
    }
    else {
        res.send(response(false));
    }
});

/* 通过平台id获取用户信息 */
router.get('/search', async function (req, res, next) {
    let { platform_id } = req.query;
    if (platform_id) {
        var user = await User.findOne({ platform_id }, { __v: 0 });
        if (user) {
            res.send(response(true, [user]));
        }
        else {
            res.send(response(false));
        }
    }
    else {
        res.send(response(false));
    }
});

/*更新用户组*/
router.patch('/group', async function (req, res, next) {
    let { group, user_id } = req.body;
    var user = await User.findByIdAndUpdate(user_id, { group: parseInt(group) });
    if (user) {
        res.send(response(true));
    }
    else {
        res.send(response(false));
    }
});

/*给用户添加金币*/
router.patch('/coin', async function (req, res, next) {
    let { coins, user_id } = req.body;
    var user = await User.findByIdAndUpdate(user_id, { $inc: { coins: parseInt(coins) } });
    if (user) {
        res.send(response(true));
    }
    else {
        res.send(response(false));
    }
});

//后台权限功能

/* 获取用户信息 */
router.get('/info', async function (req, res, next) {

    let user = {
        userInfo: {
            id: '4291d7da9005377ec9aec4a71ea837f',
            name: '天野远子',
            username: 'admin',
            password: '',
            avatar: '/avatar2.jpg',
            status: 1,
            telephone: '',
            lastLoginIp: '27.154.74.117',
            lastLoginTime: 1534837621348,
            creatorId: 'admin',
            createTime: 1497160610259,
            merchantCode: 'TLif2btpzg079h15bk',
            deleted: 0,
            roleId: 'admin',
            role: {}
        },
        role: {
            id: 'admin',
            name: '管理员',
            describe: '拥有所有权限',
            status: 1,
            creatorId: 'system',
            createTime: 1497160610259,
            deleted: 0,
            permissions: [
                {
                    roleId: 'admin',
                    permissionId: 'dashboard',
                    permissionName: '仪表盘',
                    actions:
                        '[{"action":"add","defaultCheck":false,"describe":"新增"},{"action":"query","defaultCheck":false,"describe":"查询"},{"action":"get","defaultCheck":false,"describe":"详情"},{"action":"update","defaultCheck":false,"describe":"修改"},{"action":"delete","defaultCheck":false,"describe":"删除"}]',
                    actionEntitySet: [
                        {
                            action: 'add',
                            describe: '新增',
                            defaultCheck: false
                        },
                        {
                            action: 'query',
                            describe: '查询',
                            defaultCheck: false
                        },
                        {
                            action: 'get',
                            describe: '详情',
                            defaultCheck: false
                        },
                        {
                            action: 'update',
                            describe: '修改',
                            defaultCheck: false
                        },
                        {
                            action: 'delete',
                            describe: '删除',
                            defaultCheck: false
                        }
                    ],
                    actionList: null,
                    dataAccess: null
                }]
        }
    }

    if (user) {
        res.send(response(true, user));
    } else {
        res.send(response(false));
    }

});


/* 获取菜单 */
router.get('/nav', async function (req, res, next) {
    try {
        //获取用户角色权限列表
        var users = await Operator.aggregate([
            {
                $lookup:
                {
                    from: "roles",
                    localField: "role_id",
                    foreignField: "_id",
                    as: "roles_docs"
                }
            },
            {
                $unwind: "$roles_docs"
            },
            {
                // $match: {_id: {$eq: ObjectID(req.user.user_id)}}
                $match: { _id: { $eq: ObjectID(req.query.user_id) } }
            }
        ]);

        let menu = [], all_menus = users[0].roles_docs.menus
        nav.forEach(v => {
            let index = all_menus.indexOf(v.id.toString());

            if (index != -1) {
                menu.push(v)
            }
        })

        /*if (nav) {
            res.send(response(true, nav));
        } else {
            res.send(response(false));
        }*/

        if (menu) {
            res.send(response(true, menu));
        } else {
            res.send(response(false));
        }
    } catch (e) {
        console.log(e.toString())
        res.send(response(false));
    }

});

/*
添加角色
*/
router.post('/addrole', async function (req, res, next) {
    let { name, description, menus } = req.body;
    const role = new Role({
        name: name,
        description: description,
        menus: menus
    });
    try {
        await role.save();
        res.send(response(true, role));
    } catch (err) {
        res.send(response(false));
    }
});


/*
编辑角色
*/
router.post('/editrole', async function (req, res, next) {
    let { role_id, name, description, menus } = req.body;
    console.log(role_id, name, description, menus)
    var user = await Role.findByIdAndUpdate(role_id, { name: name, description: description, menus: menus });
    if (user) {
        res.send(response(true));
    }
    else {
        res.send(response(false));
    }
});

/*
删除角色
*/
router.post('/deleterole', async function (req, res, next) {
    let { _id } = req.body;
    let count = await Operator.find({ role_id: ObjectID(_id) }).countDocuments();
    if (count) {
        res.send(response(false));
        return false;
    }

    var answer = await Role.deleteMany({ _id: _id });
    if (answer.ok) {
        res.send(response(true));
    }
    else {
        res.send(response(false));
    }
});


/*
获取角色
*/
router.get('/roles', async function (req, res, next) {
    let { pageNo, pageSize } = req.query;
    var roles = await Role.find({}, { __v: 0 }, { skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize) });
    let totalCount = await Role.find().countDocuments();
    let totalPage = Math.ceil(totalCount / parseInt(pageSize));
    if (roles) {
        res.send(responseWithPageInfo(true, roles, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
    else {
        res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
    }
});


/*
获取后台用户列表
*/
router.get('/lists', async function (req, res, next) {
    try {
        let { pageNo, pageSize } = req.query;
        // var users = await Operator.find({}, { __v: 0 },{skip: parseInt(pageNo - 1) * parseInt(pageSize), limit: parseInt(pageSize) });
        var users = await Operator.aggregate([
            {
                $lookup:
                {
                    from: "roles",
                    localField: "role_id",
                    foreignField: "_id",
                    as: "roles_docs"
                }
            },
            /*{
                $unwind: "$roles_docs"
            },*/
            { $unwind: { path: "$roles_docs", preserveNullAndEmptyArrays: true } },
            { $skip: parseInt(pageNo - 1) * parseInt(pageSize) },
            { $limit: parseInt(pageSize) },
        ]);
        let totalCount = await Operator.find().countDocuments();
        let totalPage = Math.ceil(totalCount / parseInt(pageSize));
        if (users) {
            res.send(responseWithPageInfo(true, users, parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
        }
        else {
            res.send(responseWithPageInfo(false, [], parseInt(pageNo), parseInt(pageSize), totalCount, totalPage));
        }
    } catch (err) {
        res.send(response(false));
    }
});

/*
添加后台用户
*/
router.post('/add', async function (req, res, next) {
    let { username, password, role_id } = req.body;

    const operator = new Operator({
        username: username,
        password: md5(password),
        role_id: ObjectID(role_id)
    });
    try {
        await operator.save();
        res.send(response(true, operator));
    } catch (err) {
        console.log(err)
        res.send(response(false));
    }
});


/*
删除后台用户
*/
router.post('/delete', async function (req, res, next) {
    let { _id } = req.body;
    var answer = await Operator.deleteMany({ _id: _id });
    console.log(answer)
    if (answer.ok) {
        res.send(response(true));
    }
    else {
        res.send(response(false));
    }
});

/*
获取角色
*/
router.get('/getroles', async function (req, res, next) {
    var roles = await Role.find({}, { _id: 1, name: 1 });
    if (roles) {
        res.send(responseWithPageInfo(true, roles));
    }
    else {
        res.send(responseWithPageInfo(false, []));
    }
});

/*
编辑用户
*/
router.post('/edituser', async function (req, res, next) {
    let { username, password, role_id, user_id } = req.body;
    if (!password) {
        var user = await Operator.findByIdAndUpdate(user_id, { username: username, role_id: role_id });
    } else {
        var user = await Operator.findByIdAndUpdate(user_id, { username: username, password: md5(password), role_id: role_id });
    }
    if (user) {
        res.send(response(true));
    }
    else {
        res.send(response(false));
    }
});


module.exports = router;
