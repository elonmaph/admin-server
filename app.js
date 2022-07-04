var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var jwt = require('express-jwt');
const { responseWithMsg, tokenErr } = require('./src/response');
require('dotenv').config({ path: '.env' })
var cors = require('cors')

var connectDB = require('./src/connectdb');

/*apis*/
var indexRouter = require('./routes/index');


/*backend-api*/
var bAdminUserRouter = require('./routes/backend-api/adminuser');
var bCategoryRouter = require('./routes/backend-api/category');
var bSectionRouter = require('./routes/backend-api/section');
var bVideosRouter = require('./routes/backend-api/videos');
var bVideoRouter = require('./routes/backend-api/video');
var bUsersRouter = require('./routes/backend-api/users');
var bUserRouter = require('./routes/backend-api/user');
var bListRouter = require('./routes/backend-api/list');
var bMetaRouter = require('./routes/backend-api/meta');
var bProductRouter = require('./routes/backend-api/product');
var bDataRouter = require('./routes/backend-api/data');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use(jwt({
    secret: process.env.jwt_secret,
    algorithms: [process.env.jwt_algorithm],
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.token) {
            return req.headers.token;
        }
        return null;
    }
}).unless({ path: ['/backend-api/adminuser/signin', '/backend-api/adminuser/signup','/backend-api/user/nav'] }));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send(responseWithMsg(false, tokenErr));
    }
});

/*apis*/
app.use('/', indexRouter);

/*backend-api*/
app.use('/backend-api/adminuser', bAdminUserRouter);
app.use('/backend-api/category', bCategoryRouter);
app.use('/backend-api/section', bSectionRouter);
app.use('/backend-api/videos', bVideosRouter);
app.use('/backend-api/video', bVideoRouter);
app.use('/backend-api/users', bUsersRouter);
app.use('/backend-api/user', bUserRouter);
app.use('/backend-api/list', bListRouter);
app.use('/backend-api/meta', bMetaRouter);
app.use('/backend-api/product', bProductRouter);
app.use('/backend-api/data', bDataRouter);

connectDB();

module.exports = app;
