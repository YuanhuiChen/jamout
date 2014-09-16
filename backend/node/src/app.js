global.PROJECT_ROOT = __dirname;


var express    = require('express'),
	port 	   = 3000,
	mongoose   = require('mongoose'),    //mongodb object modeling for nodejs
	morgan	   = require('morgan'), // http requrest logger middleware
    http 	   = require('http'),
    cons 	   = require('consolidate'),
    bodyParser = require('body-parser'), //bodyparser + json + urlencoder
    jwt        = require('express-jwt'),
    //tokenManager = require(PROJECT_ROOT + '/config/token_manager'),
    secret = require(PROJECT_ROOT + '/config/secret'),
    pageRoutes = require(PROJECT_ROOT + '/routes/pageRoutes'),
    apiRoutes  = require(PROJECT_ROOT + '/routes/apiRoutes'),
    configDB   = require(PROJECT_ROOT + '/config/database');


/*
 * Configuration
 */

mongoose.connect(configDB.url);  // connect to mongoDB database      


var app = express();
app.engine('dust', cons.dust);
app.use(bodyParser.json()); // getinfromation from html forms (might not need it. for testing)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev')); // log every reqeuest to the console


app.set('view engine', 'dust');
app.set('views', PROJECT_ROOT + '/views');
app.use(express.static(PROJECT_ROOT + '/public', {redirect: false}));



/*
 * Routes
 */

 app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

//HOME
app.get('/', pageRoutes.pageWelcome);
app.get('/welcome.html', pageRoutes.pageWelcome);

//LOGIN
app.get('/login.html', pageRoutes.pageLogin);
app.post('/api/login', apiRoutes.apiLogin);

//SIGNUP
app.get('/signup.html', pageRoutes.pageSignup);
app.post('/api/signup', apiRoutes.apiSignup);

//PROFILE
app.get('/profile.html', pageRoutes.pageProfile);
app.post('/api/profile', jwt({secret: secret.secretToken}), apiRoutes.apiProfile);

/*app.get('/welcome.html', function(req, res) {
    res.send("Welcome Aboard!!");

});*/


http.createServer(app).listen(port, function() {
    console.log("The party is @ port " + port);
});