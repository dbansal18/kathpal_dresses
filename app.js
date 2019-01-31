var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var logger = require('morgan');

var passport = require('passport');
var passportSetup = require('./config/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var shopRouter = require('./routes/shop-routes');

//user router
var authRouter = require('./routes/user/auth-routes');
var registerRouter = require('./routes/user/register-routes');
var rentRouter = require('./routes/user/rent-routes');

//admin routes
var addProductRouter = require('./routes/admin/addProduct-routes');
var editProductRouter = require('./routes/admin/editProduct-routes');
var rentAdminRouter = require('./routes/admin/rentAdmin-routes');

var mongoose = require('mongoose');
var keys = require('./config/keys');

var app = express();

// set up session cookies
app.use(cookieSession({
    maxAge: 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
	console.log('listning on port 3000');
    console.log('connected to mongodb');
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/shop', shopRouter);

//user 
app.use('/auth', authRouter);
app.use('/register', registerRouter);
app.use('/rent', rentRouter);

//admin
app.use('/admin/add-product', addProductRouter);
app.use('/admin/edit', editProductRouter);
app.use('/admin/rent', rentAdminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  error = {
    stack: 'Please try any other request',
    status: 404
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error', {error: error});
});

module.exports = app;
