global.PROJECT_ROOT = __dirname;


var express    = require('express'),
	port 	   = 3000,
    bodyParser = require('body-parser'),
    mongoose   = require('mongoose'),    //mongodb object modeling for nodejs
    morgan     = require('morgan'), // http requrest logger middleware
    http       = require('http'),
    cons       = require('consolidate'),
    jwt        = require('express-jwt'),
    secret = require(PROJECT_ROOT + '/config/secret'),
    pageRoutes = require(PROJECT_ROOT + '/routes/pageRoutes'),
    apiRoutes  = require(PROJECT_ROOT + '/routes/apiRoutes'),
    configDB   = require(PROJECT_ROOT + '/config/database'),
    message = require(PROJECT_ROOT + '/models/messageModel'),
    routes = require(PROJECT_ROOT + '/routes/');

//Configuration ===============================================================

mongoose.connect(configDB.url);  // connect to mongoDB database


var app = express();
app.engine('dust', cons.dust);
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true}));

app.use(morgan('dev')); // log every reqeuest to the console


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
//Routes =======================================================================
//HOME
app.get('/', pageRoutes.pageWelcome);
app.get('/welcome.html', pageRoutes.pageWelcome);
//LOGIN
app.get('/login.html', pageRoutes.pageLogin);
//app.post('/api/login', apiRoutes.apiLogin);

//LOGOUT
app.get('/logout.html', pageRoutes.pageLogout);
// use jwt to restrict routes. Success response on valid auth header token
//app.get('/api/logout', jwt({secret: secret.secretToken}), apiRoutes.apiLogout);

//SIGNUP
app.get('/signup.html', pageRoutes.pageSignup);
//app.post('/api/signup', apiRoutes.apiSignup);

//PROFILE
app.get('/profile.html', /*jwt({secret: secret.secretToken}),*/ pageRoutes.pageProfile);
//app.get('/api/profile', jwt({secret: secret.secretToken}), apiRoutes.apiProfile);

//TODO
// app.get('/api/profile/:id', jwt({secret: secret.secretToken}), function(req, res) {
//     console.log(req.user.id);
//     console.log(req.params.id);
//   res.send('profile id: ' + req.params.id);
// });

/*app.get('/welcome.html', function(req, res) {
    res.send("Welcome Aboard!!");

});*/

app.get('*', pageRoutes.pageWelcome);

http.createServer(app).listen(port, function() {
    console.log("The party is @ port " + port);
});