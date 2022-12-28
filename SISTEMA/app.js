var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash')
var session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('naoTaoSecreta'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash())

app.use(session({
  secret: 'notSecret',
  cookie: { maxAge: 2*60*1000},
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

let dao = require('./database/dao');
const bcrypt = require('bcryptjs/dist/bcrypt');

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  try {
      const user = findUserById(id);
      done(null, user);
  } catch (err) {
      done(err, null);
  }
});

let strategyConfig = {
  usernameField: 'username',
  passwordField: 'password',
}


passport.use(new LocalStrategy (strategyConfig, function (username, password, done){

  dao.findByUsername(username)
  .then( ([rows]) =>{
    if ( rows.length == 0) return done(null, false)

    let user = rows[0]

    let bcryptjs = require('bcryptjs')
    var salt = bcryptjs.genSaltSync(10);
    var hash = bcryptjs.hashSync(password, salt)
  


    if(user.password == hash) return done(null, false)
    else return done(null, user)
  }).catch( err =>{
    console.log(err)
    return done(err, null)
  })

}))

let middlewareAutorization = function( req, resp, next){
  if (req.isAuthenticated()) return next()
  else resp.redirect('/login')
}



var formRouter = require('./routes/form')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var alunosRouter = require('./routes/alunos');
var loginRouter = require('./routes/login');
const { findByUsername } = require('./database/dao');


app.use('/', indexRouter);
app.use('/users', middlewareAutorization , usersRouter);
app.use('/alunos' ,middlewareAutorization,alunosRouter);
app.use('/login' ,loginRouter)
app.use('/form', formRouter)


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
