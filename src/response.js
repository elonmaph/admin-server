function responseWithMsg(isSuccess, msg, data = {}) {
    return {
        code: isSuccess ? 0 : -1,
        msg,
        data
    }
}

function responseWithPageInfo(isSuccess, data = [], pageNo, pageSize, totalCount, totalPage) {
    return {
        code: isSuccess ? 0 : -1,
        msg:isSuccess ? "请求成功" : "请求失败",
        data,
        pageNo,
        pageSize,
        totalCount,
        totalPage
    }
}

function response(isSuccess, data = {}) {
    if (isSuccess)
        return responseWithMsg(isSuccess, successInfo, data);
    else
        return responseWithMsg(isSuccess, failInfo, data);
}

const successInfo = "请求成功";
const failInfo = "请求失败";
const paraErr = "参数错误";
const loginErr = "登录失败";
const tokenErr = "token无效";
const bindErr = "已经绑定了账号";
const bindFailErr = "绑定失败";
const accountExitsErr = "账号已存在，请换个账号绑定";
const loginFirstErr = "请先登录";
const neverbindErr = "未绑定账号";
const invaPasswordErr = "密码错误";
const invaPidErr = "无效的平台id";
const videoExitsinListErr = "视频在该视频列表中";
const videoCategoryExitsErr = "视频分类信息已存在";
const videoTagExitsErr = "视频标签信息已存在";

module.exports = {
    response,
    responseWithMsg,
    responseWithPageInfo,
    successInfo,
    failInfo,
    paraErr,
    loginErr,
    tokenErr,
    bindErr,
    bindFailErr,
    accountExitsErr,
    loginFirstErr,
    neverbindErr,
    invaPasswordErr,
    invaPidErr,
    videoExitsinListErr,
    videoCategoryExitsErr,
    videoTagExitsErr
};