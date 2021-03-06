var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var multer = require('multer');
var flash = require('connect-flash');
var fileUpload = require('express-fileupload');

var db = mongoose.createConnection('mongodb://localhost/nodeBlog');
var db_login = mongoose.createConnection('mongodb://localhost/loginapp');
var index = require('./routes/index');
var users = require('./routes/users');
var posts = require('./routes/posts');
var categories = require('./routes/categories');

var app = express();

app.locals.moment = require('moment');

app.locals.truncatedText = function(text, length){
	var truncatedText = text.substring(0,length)+' ...';
	return truncatedText;
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(multer({dest:'./public/images/uploads/'}).any());

//app.use(fileUpload());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//handle express sessions
app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave: true
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value) {
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param : formParam,
			msg   : msg,
			value : value
		};

	}
	
}));

app.use(express.static(path.join(__dirname, 'public')));

//Connect flash
app.use(flash());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req,res);
	next();
});

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use('/', index);
app.use('/users', users);
app.use('/posts', posts);
app.use('/categories', categories);

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
