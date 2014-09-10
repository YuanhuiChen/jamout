global.PROJECT_ROOT = __dirname;


var express    = require('express'),
	port 	   = 3000,
    http 	   = require('http'),
    cons 	   = require('consolidate'),
    pageRoutes = require(PROJECT_ROOT + '/routes/pageRoutes');
    apiRoutes  = require(PROJECT_ROOT + '/routes/apiRoutes');


var app = express();
app.engine('dust', cons.dust);

app.set('view engine', 'dust');
app.set('views', PROJECT_ROOT + '/views');
app.use(express.static(PROJECT_ROOT + '/public', {redirect: false}));

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
app.post('/api/profile', apiRoutes.apiProfile);

/*app.get('/welcome.html', function(req, res) {
    res.send("Welcome Aboard!!");

});*/


http.createServer(app).listen(port, function() {
    console.log("The party is @ port " + port);
});