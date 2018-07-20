var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var logger = require('morgan');

var app = express();

var indexRouter = require('./routes/index');
var parserRouter = require('./routes/parser');
var parserProRouter = require('./routes/parserPro');
var redisParserRouter = require('./routes/redisParser');
var redisParserProRouter = require('./routes/redisParserPro');
var historyScan = require('./routes/historyScan');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/parser', parserRouter);
app.use('/parserPro', parserProRouter);
app.use('/redisParser', redisParserRouter);
app.use('/redisParserPro', redisParserProRouter);
app.use('/historyScan', historyScan);

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
