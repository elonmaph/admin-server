const { responseWithMsg, loginFirstErr } = require('../src/response');

module.exports = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send(responseWithMsg(false, loginFirstErr));
    }

    next();
};
