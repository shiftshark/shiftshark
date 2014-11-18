var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongodb = require('mongodb');
var mongoose = require('mongoose');

/////////////
// Schemas //
/////////////

var Employee = require('./models/employee');
var Position = require('./models/position');
var Schedule = require('./models/schedule');
var Shift = require('./models/shift');
var Availability = require('./models/availability');

////////////////
// CONNECT DB //
////////////////

var connection_string = 'localhost:27017/shiftshark';

if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/openshiftappname'; // CHANGE LATER!
}

var db = mongoose.connect(connection_string);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
  app.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080,
    process.env.OPENSHIFT_NODEJS_IP);
});

///////////////
// USER AUTH //
///////////////

passport.use(new LocalStrategy(Employee.authenticate()));
passport.serializeUser(Employee.serializeUser());
passport.deserializeUser(Employee.deserializeUser());

/////////////
// EXPRESS //
/////////////

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'der Zeithai, ja?',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'tests')));

///////////
// EMAIL //
///////////

var transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    auth: {
      user: 'shiftsharknoreply@gmail.com',
      pass: 'fjfjfjfjsharkFj'
    }
}));

app.use(function (req, res, next) {
  res.mailer = transporter;
  next();
});

/////////////
// ROUTING //
/////////////

app.use('/', require('./routes/routes'));
app.use('/shifts', require('./routes/shifts'));
app.use('/avails', require('./routes/avails'));
app.use('/positions', require('./routes/positions'));
app.use('/users', require('./routes/users'));

////////////////////
// ERROR HANDLING //
////////////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
