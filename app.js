var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');
var session = require('express-session');
const hbshelpers = require('handlebars-helpers');
const multihelpers = hbshelpers();



var homeRouter = require('./routes/home_router');
var apiRouter = require('./routes/api_router');
var userRouter = require('./routes/user_router');
var projectRouter = require('./routes/project_router');
var customerRouter = require('./routes/customer_router');
const {sessionChecker} = require("./helper/helper")
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({helpers: multihelpers,extname: '.hbs'}));
app.set('view engine', '.hbs');
app.enable('view cache');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  key: 'user_sid',
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    sameSite: false,
    secure: false,
    expires: 600000 
  }
}))

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
  if (req.cookies.user_sid && !req.session.user) {
      res.clearCookie('user_sid');        
  }
  next();
});



// app.use((req, res, next)=>{
//   app.locals.error_message = req.flash('error_message')
//   next();
// });

app.use('/', homeRouter);
app.use('/api/v1', apiRouter);
app.use('/users', userRouter);
//app.use('/projects',sessionChecker,  projectRouter);
app.use('/projects',sessionChecker, projectRouter);
app.use('/customers',sessionChecker, customerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
