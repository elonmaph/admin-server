var express = require('express');
var router = express.Router();
const Operator = require('../../schema/operatorModel');
var mongoose = require('mongoose');
const { response, responseWithMsg, loginErr, bindErr, bindFailErr, accountExitsErr, neverbindErr, invaPasswordErr } = require('../../src/response');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function md5(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

/*
账号登录
*/
router.post('/signin', async function (req, res, next) {
  const { username, password } = req.body;

  var user = await Operator.findOne({ username }, { __v: 0 });
  if (user) {
    const validPassword = user.validPassword(password);
    if (validPassword) {
      const token = jwt.sign({ user_id: user._id }, process.env.jwt_secret);
      user._doc.token = token;
      res.send(response(true, user));
    }
    else {
      res.send(responseWithMsg(false, loginErr));
    }
  }
  else {
    res.send(responseWithMsg(false, loginErr));
  }
});

/*生成账号*/
router.post('/signup', async function (req, res, next) {
  const { username } = req.body;

  var user = await Operator.findOne({ username }, { __v: 0 });
  if (user) {
    res.send(responseWithMsg(false, accountExitsErr));
  }
  else {
    const user = new Operator({
      username,
      password: md5('123456')
    });
    try {
      await user.save();
      res.send(response(true, user));
    } catch (err) {
      res.send(response(false));
    }
  }
});

/*
修改密码
*/
router.post('/password', async function (req, res, next) {
  const { org_password, password } = req.body;
  var user = await User.findById(req.user.user_id, { username: 1, password: 1 });
  if (user.username) {
    if (user.validPassword(org_password)) {
      try {
        await User.findByIdAndUpdate(req.user.user_id, { password: md5(password) });
        res.send(response(true));
      } catch (error) {
        res.send(response(false));
      }
    }
    else {
      res.send(responseWithMsg(false, invaPasswordErr));
    }
  }
  else {
    res.send(responseWithMsg(false, neverbindErr));
  }
});

module.exports = router;
