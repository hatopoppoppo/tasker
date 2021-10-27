const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const session = require('express-session');

const User = require('./models/user');
const Task = require('./models/task');
const TaskDate = require('./models/taskdate');
const Auth = require('./models/auth');
const Provisional = require('./models/provisional');
User.sync().then(() => {
  Task.belongsTo(User,{foreignKey:"userId"});
  Task.sync();
  TaskDate.belongsTo(User,{foreignKey:"userId"});
  TaskDate.sync();
  Auth.belongsTo(User,{foreignKey:"userId"});
  Auth.sync();
  Provisional.sync();
});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');

const app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const sessionMiddleware = session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie:{
  httpOnly: false,
  secure: false,
  maxage: 1000 * 60 * 60 * 24 * 7
}});
app.use(sessionMiddleware);
app.session = sessionMiddleware;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/register',registerRouter);
app.use('/auth',authRouter);

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
