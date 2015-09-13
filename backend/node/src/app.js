global.PROJECT_ROOT = __dirname;


var express    = require('express'),
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),    //mongodb object modeling for nodejs
    morgan     = require('morgan'), // http requrest logger middleware
    http       = require('http'),
    cons       = require('consolidate'),
    jwt        = require('express-jwt'),
    socketio   = require('socket.io'),
    secret     = require(PROJECT_ROOT + '/config/secret'),
    pageRoutes = require(PROJECT_ROOT + '/routes/pageRoutes'),
    apiRoutes  = require(PROJECT_ROOT + '/routes/apiRoutes'),
	  port 	     = require(PROJECT_ROOT + '/config/port'), //3000,
    configDB   = require(PROJECT_ROOT + '/config/database'),
    message    = require(PROJECT_ROOT + '/models/messageModel'),
    routes     = require(PROJECT_ROOT + '/routes/'),
    socket     = require(PROJECT_ROOT + '/routes/socket.js');

/***************************Configuration ***********************************/

mongoose.connect(configDB.local);  // connect to mongoDB. Choose bewteen configDB.mongolab or configDB.local


var app    = express(),
    server = http.createServer(app),
    io     = socketio.listen(server, {log: true});



app.engine('dust', cons.dust);
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true}));

app.use(morgan('dev')); // log every reqeuest to the console


app.set('socketio', io);
app.set('server', server);
app.set('view engine', 'dust');
app.set('views', PROJECT_ROOT + '/views');
app.use(express.static(PROJECT_ROOT + '/public', {redirect: false}));

app.get('/*',function(req,res,next){
    res.header('X-XSS-Protection' , 0 );
    next(); // http://expressjs.com/guide.html#passing-route control
});

app.all('*', function(req, res, next) {
 // res.header('Authorization', 0);
  res.set('Access-Control-Allow-Origin', 'http://localhost');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT', 'OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

routes.dispatch(app);

/***************************Routes***********************************/
//HOME
app.get('/', pageRoutes.pageInviteonly);
// app.get('/', pageRoutes.pageWelcome);
app.get('/welcome', pageRoutes.pageWelcome);
app.get('/login', pageRoutes.pageLogin);
app.get('/logout', pageRoutes.pageLogout);
app.get('/signup', pageRoutes.pageSignup);
// PROFILE
app.get('/profile',  pageRoutes.pageProfile);
app.get('/profile/edit', pageRoutes.pageProfileEdit);
app.get('/profile/:id',  pageRoutes.pageProfileUrlView);

//ROOM
app.get('/room/:id', pageRoutes.pageRoom);
app.get('*', pageRoutes.pageWelcome);


socket.start(io);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// todo: production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.status(500).send('internal server error');
});


app.get('server').listen(port.ADDRESS, function() {
    console.log("The party is @ port " + port.ADDRESS + " :)");
});

