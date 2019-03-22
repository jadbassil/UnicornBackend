var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const config = require('./config');


//auth
var login = require('./routes/auth/login');
var register = require('./routes/auth/register');
var logout = require('./routes/auth/logout');
var verification = require('./routes/auth/verification');

//admin auth and registration
var admin = require('./routes/admins/admin');

//Deals
var add = require('./routes/deals/add');
var deals = require('./routes/deals/deals');
var del = require('./routes/deals/delete');

//oauth
var oauth = require('./routes/oauth/oauth');

var app = express();
mongoose.connect('mongodb://localhost:27017/unicorn');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//token verification middleware
app.use(function(req, res, next){
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(token != null){
    req.token = token;
    jwt.verify(token, config.secret, function(err, decoded){
      if(err) {
        err.message = 'unverified token';
        return res.send({success: false, message: 'unverified token'});
      }
      req.decoded = decoded;
      console.log(decoded);
      next();
    });
  }else{
    next();
  }
});

//oauth
app.use('/oauth', oauth);

//auth
app.use('/api/login', login);
app.use('/api/register', register);
app.use('/api/logout', logout);
app.use('/api/verification', verification);

//admin auth and registration
app.use('/api/admin', admin);

//deals
app.use('/api/deals/add', add);
app.use('/api/deals', deals);
app.use('/api/deals/delete', del);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
