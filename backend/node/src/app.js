global.PROJECT_ROOT = __dirname;


var express = require('express'),
    http = require('http'),
    cons = require('consolidate'),
    pageRoutes = require(PROJECT_ROOT + '/routes/pageRoutes');


var app = express();
app.engine('dust', cons.dust);



app.set('view engine', 'dust');
app.set('views', PROJECT_ROOT + '/views');
app.use(express.static(PROJECT_ROOT + '/public', {redirect: false}));

//app.configure(function() {
   // app.set('port', 3000);
   // app.set('view engine', 'dust');
   // app.set('views', __dirname + '/views');
    //set file path
    //app.use(express.static(__dirname + '/public', {redirect: false}));
//});

app.get('/welcome.html', pageRoutes.pageWelcome);

/*app.get('/welcome.html', function(req, res) {
    res.send("Welcome Aboard!!");

});*/


http.createServer(app).listen(3000, function() {
    console.log("listen to 3000");
});